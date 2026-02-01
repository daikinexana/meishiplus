"use client";

import { useEffect, useRef, useState } from "react";

interface TemplatePreviewProps {
  templateId: string;
}

export default function TemplatePreview({ templateId }: TemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
    };

    iframe.addEventListener("load", handleLoad);
    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600"></div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={`/samples/${templateId}`}
        className="h-full w-full scale-[0.25] origin-top-left pointer-events-none"
        style={{
          width: "400%",
          height: "400%",
          border: "none",
        }}
        title={`${templateId} プレビュー`}
      />
    </div>
  );
}
