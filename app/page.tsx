"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import PromptChips from "@/components/home/PromptChips";
import PromptInput from "@/components/home/PromptInput";

const EXAMPLE_PROMPTS = [
  "A mobile fitness tracking app",
  "E-commerce product page with cart",
  "Admin dashboard with tables and charts",
  "Landing page for a SaaS startup",
];

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"standard" | "experimental">("standard");
  const [designType, setDesignType] = useState<"web" | "app">("web");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const params = new URLSearchParams({
      prompt: prompt.trim(),
      mode,
    });
    router.push(`/studio?${params.toString()}`);
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "#ededed",
      }}
    >
      {/* <Navbar /> */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 48px",
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: 680,
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: "3.2rem",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: 40,
            }}
          >
            Welcome to <span style={{ fontWeight: 600 }}>Stitch.</span>
          </motion.h1>

          <PromptChips
            prompts={EXAMPLE_PROMPTS}
            onChipClick={(example) => setPrompt(example)}
          />

          <PromptInput
            prompt={prompt}
            onPromptChange={setPrompt}
            mode={mode}
            onModeToggle={() =>
              setMode(mode === "standard" ? "experimental" : "standard")
            }
            designType={designType}
            onDesignTypeChange={setDesignType}
            onSubmit={handleGenerate}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 24,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#6366f1",
              }}
            />
            <span style={{ fontSize: 13, color: "#444" }}>
              Powered by Claude AI
            </span>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
