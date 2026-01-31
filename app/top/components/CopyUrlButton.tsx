"use client";

import { useState } from "react";

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
    >
      {copied ? "コピーしました！" : "コピー"}
    </button>
  );
}
