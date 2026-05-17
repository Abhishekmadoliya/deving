"use client";

import { useState, useRef, useEffect } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import {
  Menu,
  Play,
  Download,
  Share2,
  Check,
  Copy,
  ChevronDown,
} from "lucide-react";

export function StitchToolbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { currentPrompt } = useDesignStore();
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const selectedVariant = useDesignStore((s) => {
    return s.variants.find((v) => v.id === s.selectedVariantId) ?? null;
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCopyCode = () => {
    if (selectedVariant) {
      navigator.clipboard.writeText(selectedVariant.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setExportOpen(false);
  };

  const handleExportHTML = () => {
    if (selectedVariant) {
      const blob = new Blob([selectedVariant.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "design.html";
      a.click();
      URL.revokeObjectURL(url);
    }
    setExportOpen(false);
  };

  const projectTitle = currentPrompt
    ? currentPrompt.length > 30
      ? currentPrompt.substring(0, 30) + "..."
      : currentPrompt
    : "Untitled Project";

  return (
    <div className="stitch-toolbar">
      {/* Left: Menu + Title */}
      <div className="stitch-toolbar__left">
        <button
          className="stitch-toolbar__icon-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu style={{ width: 18, height: 18 }} />
        </button>
        <span className="stitch-toolbar__title">{projectTitle}</span>
      </div>

      {/* Right: Actions */}
      <div className="stitch-toolbar__right">
        {/* Play / Preview */}
        <button className="stitch-toolbar__action-btn stitch-toolbar__play-btn">
          <Play style={{ width: 14, height: 14, fill: "currentColor" }} />
        </button>

        {/* Export */}
        <div style={{ position: "relative" }} ref={exportRef}>
          <button
            className="stitch-toolbar__action-btn"
            onClick={() => setExportOpen(!exportOpen)}
          >
            <Download style={{ width: 14, height: 14 }} />
            Export
          </button>
          {exportOpen && (
            <div className="stitch-toolbar__dropdown">
              <button
                className="stitch-toolbar__dropdown-item"
                onClick={handleExportHTML}
              >
                Download HTML/CSS
              </button>
              <button
                className="stitch-toolbar__dropdown-item"
                onClick={handleCopyCode}
              >
                Copy Code
                {copied ? (
                  <Check
                    style={{ width: 14, height: 14, color: "#22c55e" }}
                  />
                ) : (
                  <Copy style={{ width: 14, height: 14, color: "#555" }} />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Share */}
        <button className="stitch-toolbar__action-btn">
          <Share2 style={{ width: 14, height: 14 }} />
          Share
        </button>

        {/* User Avatar */}
        <div className="stitch-toolbar__avatar">A</div>
      </div>
    </div>
  );
}
