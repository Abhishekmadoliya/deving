"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDesignStore } from "@/store/useDesignStore";
import { StudioToolbar } from "@/components/studio/Toolbar";
import { ChatPanel } from "@/components/studio/ChatPanel";
import { DesignCanvas } from "@/components/studio/DesignCanvas";

function StudioContent() {
  const searchParams = useSearchParams();
  const hasTriggered = useRef(false);
  const {
    setCurrentPrompt,
    setGenerationMode,
    setVariants,
    setIsGenerating,
    addHistoryItem,
    addChatMessage,
    setCanvasTab,
  } = useDesignStore();

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    const mode =
      (searchParams.get("mode") as "standard" | "experimental") || "standard";

    if (prompt && !hasTriggered.current) {
      hasTriggered.current = true;
      setCurrentPrompt(prompt);
      setGenerationMode(mode);
      generateDesign(prompt, mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const generateDesign = async (
    prompt: string,
    mode: "standard" | "experimental"
  ) => {
    setIsGenerating(true);
    setCanvasTab("variants");

    addChatMessage({
      role: "user",
      content: prompt,
    });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();
      setVariants(data.variants);

      addHistoryItem({
        id: crypto.randomUUID(),
        prompt,
        timestamp: Date.now(),
        variants: data.variants,
      });

      addChatMessage({
        role: "assistant",
        content: `I've generated 3 design variants for your request. Select the one you like best, and I can iterate on it further.`,
      });
    } catch (error) {
      console.error("Generation error:", error);
      addChatMessage({
        role: "assistant",
        content: `Sorry, there was an error generating the design. ${
          error instanceof Error ? error.message : "Please try again."
        }`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      <StudioToolbar />
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <ChatPanel />
        <DesignCanvas />
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#6366f1",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <span style={{ color: "#888", fontSize: 14 }}>
            Loading studio...
          </span>
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
