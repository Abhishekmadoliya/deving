"use client";

import { useState } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import {
  Layers,
  History,
  ChevronRight,
  ChevronDown,
  Box,
  Type,
  BarChart3,
  Layout,
  Navigation,
  Square,
  Clock,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Component icon mapping
const COMPONENT_ICONS: Record<string, React.ReactNode> = {
  Navbar: <Navigation className="w-3.5 h-3.5" />,
  Sidebar: <Layout className="w-3.5 h-3.5" />,
  Card: <Square className="w-3.5 h-3.5" />,
  Chart: <BarChart3 className="w-3.5 h-3.5" />,
  Button: <Box className="w-3.5 h-3.5" />,
  Header: <Type className="w-3.5 h-3.5" />,
  Footer: <Layout className="w-3.5 h-3.5" />,
  Table: <BarChart3 className="w-3.5 h-3.5" />,
  Form: <Square className="w-3.5 h-3.5" />,
  Modal: <Square className="w-3.5 h-3.5" />,
  Hero: <Layout className="w-3.5 h-3.5" />,
  Section: <Box className="w-3.5 h-3.5" />,
};

function getIcon(name: string) {
  return COMPONENT_ICONS[name] || <Box className="w-3.5 h-3.5" />;
}

function ComponentTreeNode({ name, depth = 0 }: { name: string; depth?: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#1f1f1f] rounded-lg text-sm transition-colors group cursor-pointer"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <span className="text-[#555] group-hover:text-[#888] transition-colors">
          {expanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </span>
        <span className="text-[#6366f1]/70">{getIcon(name)}</span>
        <span className="text-[#ccc] group-hover:text-white truncate transition-colors">
          {name}
        </span>
      </button>
    </div>
  );
}

function LayersPanel() {
  const selectedVariant = useDesignStore((s) => {
    const v = s.variants.find((v) => v.id === s.selectedVariantId);
    return v ?? null;
  });

  const components = selectedVariant?.components || [];

  if (components.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Layers className="w-8 h-8 text-[#333] mb-3" />
        <p className="text-sm text-[#555]">No layers yet</p>
        <p className="text-xs text-[#444] mt-1">
          Generate a design to see component layers
        </p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="px-4 py-2 mb-1">
        <p className="text-[11px] text-[#555] uppercase tracking-wider font-medium">
          Components
        </p>
      </div>
      {components.map((comp, i) => (
        <ComponentTreeNode key={`${comp}-${i}`} name={comp} />
      ))}
    </div>
  );
}

function HistoryPanel() {
  const { history, restoreHistoryItem } = useDesignStore();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <History className="w-8 h-8 text-[#333] mb-3" />
        <p className="text-sm text-[#555]">No history yet</p>
        <p className="text-xs text-[#444] mt-1">
          Your design iterations will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="py-2 space-y-1">
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => restoreHistoryItem(item.id)}
          className="w-full px-4 py-3 hover:bg-[#1f1f1f] transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-[#555]" />
            <span className="text-[11px] text-[#555]">
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-sm text-[#aaa] group-hover:text-white truncate transition-colors leading-relaxed">
            {item.prompt}
          </p>
          <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <RotateCcw className="w-3 h-3 text-[#6366f1]" />
            <span className="text-[10px] text-[#6366f1]">Restore</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export function Sidebar() {
  const { sidebarTab, setSidebarTab } = useDesignStore();

  return (
    <div className="w-[240px] bg-[#0f0f0f] border-r border-[#1e1e1e] flex flex-col shrink-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#1e1e1e]">
        <button
          onClick={() => setSidebarTab("layers")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
            sidebarTab === "layers"
              ? "text-white border-b-2 border-[#6366f1] bg-[#6366f1]/5"
              : "text-[#666] hover:text-[#aaa]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Layers
        </button>
        <button
          onClick={() => setSidebarTab("history")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
            sidebarTab === "history"
              ? "text-white border-b-2 border-[#6366f1] bg-[#6366f1]/5"
              : "text-[#666] hover:text-[#aaa]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {sidebarTab === "layers" ? (
            <motion.div
              key="layers"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <LayersPanel />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <HistoryPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
