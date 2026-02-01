import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// S3クライアントの初期化
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

// 許可する画像形式
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// 最大ファイルサイズ（制限なし）
// const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // 認証チェック
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 環境変数のチェック
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
      return NextResponse.json(
        { error: "AWS S3 configuration is missing" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { fileName, fileType, fileSize } = body;

    // ファイルタイプの検証
    if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // ファイルサイズの検証（制限なし）
    // if (!fileSize || fileSize > MAX_FILE_SIZE) {
    //   return NextResponse.json(
    //     { error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
    //     { status: 400 }
    //   );
    // }

    // ファイル名を生成（ユーザーID + UUID + 元の拡張子）
    const fileExtension = fileName.split(".").pop() || "jpg";
    const uniqueFileName = `${userId}/${uuidv4()}.${fileExtension}`;

    // S3へのアップロード用コマンドを作成
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
      // ACLは最近のS3バケットでは無効化されている場合があるため、コメントアウト
      // バケットポリシーでパブリック読み取りを許可する場合は、ACLは不要
      // ACL: "public-read",
    });

    // 署名付きURLを生成（有効期限: 5分）
    // Content-Typeヘッダーを署名に含める
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5分
    });

    console.log("Generated signed URL for:", {
      fileName: uniqueFileName,
      fileType: fileType,
      bucket: BUCKET_NAME,
      region: process.env.AWS_REGION || "ap-northeast-1",
      urlLength: signedUrl.length,
      urlPreview: signedUrl.substring(0, 150) + "...",
    });

    // アップロード後の公開URL
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-northeast-1"}.amazonaws.com/${uniqueFileName}`;

    return NextResponse.json({
      signedUrl,
      publicUrl,
      fileName: uniqueFileName,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
