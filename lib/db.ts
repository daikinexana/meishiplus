import { Pool } from "pg";

// Neon PostgreSQL接続プール
// 環境変数DATABASE_URLから接続情報を取得
const connectionString = process.env.DATABASE_URL;

// SSL設定を明示的に追加（NeonはSSL接続を要求）
// 警告を回避するため、sslmode=verify-fullを明示的に指定
let finalConnectionString = connectionString;

if (connectionString && !connectionString.includes('sslmode=')) {
  // DATABASE_URLにSSL設定がない場合は追加
  const separator = connectionString.includes('?') ? '&' : '?';
  finalConnectionString = `${connectionString}${separator}sslmode=verify-full`;
}

const pool = new Pool({
  connectionString: finalConnectionString,
  // Neonはサーバーレスなので、接続プールの設定を調整
  max: 1, // サーバーレス環境では1接続が推奨
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 接続エラーのハンドリング
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

/**
 * データベースクエリを実行
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log("Executed query", { text, duration, rows: res.rowCount });
    }
    return res.rows as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

/**
 * 単一の行を取得
 */
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

/**
 * 接続プールを終了（アプリケーション終了時など）
 */
export async function closePool() {
  await pool.end();
}

// Next.jsの開発環境でHMR時に接続を維持
if (process.env.NODE_ENV !== "production") {
  // グローバル変数に保存してHMR時に再利用
  const globalForPool = globalThis as unknown as {
    pool: Pool | undefined;
  };

  if (!globalForPool.pool) {
    globalForPool.pool = pool;
  }
}

export { pool };
