"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { Monitor, Smartphone, Tablet, Maximize2, RotateCcw } from "lucide-react";
import { useState } from "react";

const VIEWPORT_SIZES = [
  { id: "desktop", icon: Monitor, width: "100%", label: "Desktop" },
  { id: "tablet", icon: Tablet, width: "768px", label: "Tablet" },
  { id: "mobile", icon: Smartphone, width: "375px", label: "Mobile" },
];

export function PreviewFrame() {
  const [viewport, setViewport] = useState("desktop");
  const [key, setKey] = useState(0);

  const selectedVariant = useDesignStore((s) => {
    const v = s.variants.find((v) => v.id === s.selectedVariantId);
    return v ?? null;
  });

  const currentWidth =
    VIEWPORT_SIZES.find((v) => v.id === viewport)?.width || "100%";

  if (!selectedVariant) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <Monitor className="w-12 h-12 text-[#333] mb-4" />
        <h3 className="text-lg font-medium text-[#666] mb-2">
          No variant selected
        </h3>
        <p className="text-sm text-[#555]">
          Select a variant from the Variants tab to preview it
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Viewport Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e1e] bg-[#0f0f0f]">
        <div className="flex items-center gap-1">
          {VIEWPORT_SIZES.map((vp) => {
            const Icon = vp.icon;
            return (
              <button
                key={vp.id}
                onClick={() => setViewport(vp.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewport === vp.id
                    ? "text-white bg-[#1a1a1a]"
                    : "text-[#666] hover:text-[#aaa]"
                }`}
                title={vp.label}
              >
                <Icon className="w-3.5 h-3.5" />
                {vp.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-1.5 rounded-lg text-[#666] hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer"
            title="Refresh preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-start justify-center overflow-auto bg-[#0d0d0d] p-4">
        <div
          className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 h-full"
          style={{ width: currentWidth, maxWidth: "100%" }}
        >
          <iframe
            key={key}
            srcDoc={selectedVariant.html}
            title="Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
