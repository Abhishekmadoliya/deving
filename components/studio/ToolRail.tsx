"use client";

import {
  MousePointer2,
  Scan,
  PenTool,
  Hand,
  ImageIcon,
  Star,
} from "lucide-react";

const TOOLS = [
  { icon: MousePointer2, label: "Select" },
  { icon: Scan, label: "Frame" },
  { icon: PenTool, label: "Pen" },
  { icon: Hand, label: "Pan" },
  { icon: ImageIcon, label: "Image" },
  { icon: Star, label: "Bookmark" },
];

export function ToolRail() {
  return (
    <div className="stitch-toolrail">
      {TOOLS.map(({ icon: Icon, label }, i) => (
        <button
          key={label}
          className="stitch-toolrail__btn"
          aria-label={label}
          title={label}
        >
          <Icon style={{ width: 18, height: 18 }} />
        </button>
      ))}
    </div>
  );
}
