"use client";

import { motion } from "framer-motion";

interface PromptChipsProps {
  prompts: string[];
  onChipClick: (prompt: string) => void;
}

export default function PromptChips({ prompts, onChipClick }: PromptChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
      }}
    >
      {prompts.map((example) => (
        <button
          key={example}
          onClick={() => onChipClick(example)}
          style={{
            padding: "8px 18px",
            borderRadius: 100,
            border: "1px solid #2a2a2a",
            backgroundColor: "transparent",
            fontSize: 13,
            color: "#999",
            cursor: "pointer",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#444";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.backgroundColor = "#141414";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#2a2a2a";
            e.currentTarget.style.color = "#999";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {example}
        </button>
      ))}
    </motion.div>
  );
}
