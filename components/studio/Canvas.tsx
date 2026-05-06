"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { VariantGrid } from "./VariantGrid";
import { PreviewFrame } from "./PreviewFrame";
import { CodeView } from "./CodeView";
import { LayoutGrid, Eye, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "variants" as const, label: "Variants", icon: LayoutGrid },
  { id: "preview" as const, label: "Preview", icon: Eye },
  { id: "code" as const, label: "Code", icon: Code2 },
];

export function Canvas() {
  const { canvasTab, setCanvasTab } = useDesignStore();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#111]">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#1e1e1e] bg-[#0f0f0f]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = canvasTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCanvasTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "text-white bg-[#1a1a1a]"
                  : "text-[#666] hover:text-[#aaa] hover:bg-[#161616]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeCanvasTab"
                  className="absolute inset-0 rounded-lg bg-[#1a1a1a] -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {canvasTab === "variants" && (
            <motion.div
              key="variants"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <VariantGrid />
            </motion.div>
          )}
          {canvasTab === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <PreviewFrame />
            </motion.div>
          )}
          {canvasTab === "code" && (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <CodeView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
