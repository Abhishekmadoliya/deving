"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { Copy, Check, Code2 } from "lucide-react";
import { useState } from "react";

export function CodeView() {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  const selectedVariant = useDesignStore((s) => {
    const v = s.variants.find((v) => v.id === s.selectedVariantId);
    return v ?? null;
  });

  const copyToClipboard = (text: string, type: "html" | "css") => {
    navigator.clipboard.writeText(text);
    if (type === "html") {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } else {
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    }
  };

  if (!selectedVariant) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <Code2 className="w-12 h-12 text-[#333] mb-4" />
        <h3 className="text-lg font-medium text-[#666] mb-2">
          No variant selected
        </h3>
        <p className="text-sm text-[#555]">
          Select a variant to view its source code
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-0">
      {/* HTML Panel */}
      <div className="flex-1 flex flex-col border-r border-[#1e1e1e]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e1e] bg-[#0f0f0f]">
          <span className="text-xs font-medium text-[#888]">HTML</span>
          <button
            onClick={() => copyToClipboard(selectedVariant.html, "html")}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-[#666] hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer"
          >
            {copiedHtml ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-[#0d0d0d]">
          <pre className="text-xs text-[#ccc] font-mono leading-relaxed whitespace-pre-wrap break-words">
            {selectedVariant.html}
          </pre>
        </div>
      </div>

      {/* CSS Panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e1e] bg-[#0f0f0f]">
          <span className="text-xs font-medium text-[#888]">CSS</span>
          <button
            onClick={() =>
              copyToClipboard(selectedVariant.css || "", "css")
            }
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-[#666] hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer"
          >
            {copiedCss ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-[#0d0d0d]">
          <pre className="text-xs text-[#ccc] font-mono leading-relaxed whitespace-pre-wrap break-words">
            {selectedVariant.css || "/* No extracted CSS — styles are embedded in the HTML */"}
          </pre>
        </div>
      </div>
    </div>
  );
}
