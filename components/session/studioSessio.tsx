"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDesignStore } from "@/store/useDesignStore";
import { StitchToolbar } from "@/components/studio/StitchToolbar";
import { ConversationSidebar } from "@/components/studio/ConversationSidebar";
import { CanvasMesh } from "@/components/studio/CanvasMesh";
import { StitchInputBar } from "@/components/studio/StitchInputBar";
import { ToolRail } from "@/components/studio/ToolRail";

export interface SessionImage {
    imageUrl: string;
    variantIndex: number;
    status: string;
    error: string | null;
}

function StudioContent({
    session,
    loading,
}: {
    session: SessionImage[] | null;
    loading: boolean;
}) {
    const searchParams = useSearchParams();
    const hasTriggered = useRef(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const {
        setCurrentPrompt,
        setGenerationMode,
        setVariants,
        setIsGenerating,
        addHistoryItem,
        addChatMessage,
        setCanvasTab,
        isGenerating,
        isIterating,
    } = useDesignStore();

    const selectedVariant = useDesignStore((s) => {
        return s.variants.find((v) => v.id === s.selectedVariantId) ?? null;
    });

    useEffect(() => {
        const prompt = searchParams.get("prompt");
        const mode =
            (searchParams.get("mode") as "standard" | "experimental") ||
            "standard";

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
                    error instanceof Error
                        ? error.message
                        : "Please try again."
                }`,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSend = async (prompt: string) => {
        if (selectedVariant) {
            // Iterate on existing design
            const { setIsIterating, updateSelectedVariant } =
                useDesignStore.getState();
            setIsIterating(true);
            addChatMessage({ role: "user", content: prompt });

            try {
                const res = await fetch("/api/iterate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        currentHtml: selectedVariant.html,
                        currentCss: selectedVariant.css,
                        conversationHistory: [],
                        editPrompt: prompt,
                    }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Iteration failed");
                }

                const data = await res.json();
                updateSelectedVariant({
                    html: data.html,
                    css: data.css,
                    components:
                        data.components || selectedVariant.components,
                    colors: data.colors || selectedVariant.colors,
                    fonts: data.fonts || selectedVariant.fonts,
                });

                addChatMessage({
                    role: "assistant",
                    content:
                        data.description || "Design updated successfully.",
                });
            } catch (error) {
                addChatMessage({
                    role: "assistant",
                    content: `Error: ${
                        error instanceof Error
                            ? error.message
                            : "Failed to update design."
                    }`,
                });
            } finally {
                setIsIterating(false);
            }
        } else {
            // Fresh generation
            setCurrentPrompt(prompt);
            generateDesign(prompt, "standard");
        }
    };

    return (
        <div className="stitch-layout">
            <StitchToolbar
                onToggleSidebar={() => setSidebarOpen((v) => !v)}
            />
            <div className="stitch-layout__body">
                <ConversationSidebar isOpen={sidebarOpen} />
                <div className="stitch-layout__center">
                    <CanvasMesh
                        sessionImages={session}
                        loading={loading}
                    />
                    <StitchInputBar onSend={handleSend} />
                </div>
                <ToolRail />
            </div>
        </div>
    );
}

export default function StudioSession({
    session,
    loading,
}: {
    session: SessionImage[] | null;
    loading: boolean;
}) {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#141414",
                        gap: 12,
                    }}
                >
                    <div
                        className="stitch-canvas__generating-spinner"
                        style={{ width: 24, height: 24 }}
                    />
                    <span style={{ color: "#666", fontSize: 14 }}>
                        Loading studio...
                    </span>
                </div>
            }
        >
            <StudioContent session={session} loading={loading} />
        </Suspense>
    );
}
