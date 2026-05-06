"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="flex-1 min-w-[280px] rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden"
    >
      {/* Preview skeleton */}
      <div className="h-[340px] animate-shimmer" />
      {/* Label skeleton */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <div className="h-4 w-32 rounded bg-[#222] animate-shimmer mb-2" />
        <div className="h-3 w-48 rounded bg-[#1f1f1f] animate-shimmer" />
      </div>
    </motion.div>
  );
}

function VariantCard({
  variant,
  index,
  isSelected,
  onSelect,
}: {
  variant: { id: string; label: string; description: string; html: string };
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`flex-1 min-w-[280px] rounded-2xl border overflow-hidden transition-all duration-300 group cursor-pointer ${
        isSelected
          ? "border-[#6366f1] shadow-[0_0_30px_rgba(99,102,241,0.2)]"
          : "border-[#2a2a2a] hover:border-[#6366f1]/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
      }`}
      onClick={onSelect}
    >
      {/* Preview iframe */}
      <div className="h-[340px] bg-white relative overflow-hidden">
        <iframe
          srcDoc={variant.html}
          title={variant.label}
          className="w-full h-full border-none pointer-events-none"
          sandbox="allow-scripts"
          style={{
            transform: "scale(0.5)",
            transformOrigin: "top left",
            width: "200%",
            height: "200%",
          }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <span className="text-white text-sm font-medium flex items-center gap-1.5 bg-[#6366f1] px-4 py-2 rounded-full">
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Selected
              </>
            ) : (
              "Select this variant"
            )}
          </span>
        </div>
        {/* Selected badge */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#6366f1] flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>
      {/* Label */}
      <div className="p-4 bg-[#1a1a1a] border-t border-[#2a2a2a]">
        <h3 className="text-sm font-medium text-white mb-1">{variant.label}</h3>
        <p className="text-xs text-[#888] line-clamp-2">{variant.description}</p>
      </div>
    </motion.div>
  );
}

export function VariantGrid() {
  const { variants, selectedVariantId, selectVariant, isGenerating } =
    useDesignStore();

  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-[#6366f1] animate-pulse-dot" />
          <Sparkles className="w-5 h-5 text-[#6366f1] animate-pulse" />
          <span className="text-[#888] text-sm">
            Generating 3 design variants...
          </span>
        </div>
        <div className="flex gap-4 w-full max-w-5xl">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7 text-[#333]" />
        </div>
        <h3 className="text-lg font-medium text-[#666] mb-2">
          No variants generated yet
        </h3>
        <p className="text-sm text-[#555] max-w-sm">
          Use the prompt bar to describe a UI and generate design variants
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex gap-4 max-w-5xl mx-auto">
        {variants.map((variant, i) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            index={i}
            isSelected={selectedVariantId === variant.id}
            onSelect={() => selectVariant(variant.id)}
          />
        ))}
      </div>
    </div>
  );
}
