"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export function QRCodeDisplay({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
      });
    }
  }, [url]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">共有</h3>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <canvas ref={canvasRef} className="rounded border border-gray-200" />
        <div className="flex-1 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                onClick={handleCopyUrl}
                className="rounded bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                {copied ? "コピーしました！" : "コピー"}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            QRコードをスキャンするか、URLをコピーして共有できます
          </p>
        </div>
      </div>
    </div>
  );
}
