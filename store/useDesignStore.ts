"use client";

import { create } from "zustand";

export interface Variant {
  id: string;
  label: string;
  description: string;
  html: string;
  css: string;
  components: string[];
  colors: string[];
  fonts: string[];
}

export interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: number;
  variants?: Variant[];
  selectedVariantId?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export type CanvasTab = "variants" | "preview" | "code";
export type RightPanelTab = "properties" | "prompt";
export type SidebarTab = "layers" | "history";
export type GenerationMode = "standard" | "experimental";

interface DesignState {
  // Prompt & Generation
  currentPrompt: string;
  generationMode: GenerationMode;
  isGenerating: boolean;
  isIterating: boolean;

  // Variants
  variants: Variant[];
  selectedVariantId: string | null;

  // Tabs
  canvasTab: CanvasTab;
  rightPanelTab: RightPanelTab;
  sidebarTab: SidebarTab;

  // History
  history: HistoryItem[];

  // Chat
  chatMessages: ChatMessage[];

  // Actions
  setCurrentPrompt: (prompt: string) => void;
  setGenerationMode: (mode: GenerationMode) => void;
  setIsGenerating: (val: boolean) => void;
  setIsIterating: (val: boolean) => void;

  setVariants: (variants: Variant[]) => void;
  selectVariant: (id: string) => void;
  getSelectedVariant: () => Variant | null;

  setCanvasTab: (tab: CanvasTab) => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setSidebarTab: (tab: SidebarTab) => void;

  addHistoryItem: (item: HistoryItem) => void;
  restoreHistoryItem: (id: string) => void;

  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChat: () => void;

  // Iterate on current design
  updateSelectedVariant: (updates: Partial<Variant>) => void;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  // Initial state
  currentPrompt: "",
  generationMode: "standard",
  isGenerating: false,
  isIterating: false,

  variants: [],
  selectedVariantId: null,

  canvasTab: "variants",
  rightPanelTab: "prompt",
  sidebarTab: "layers",

  history: [],
  chatMessages: [],

  // Actions
  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  setGenerationMode: (mode) => set({ generationMode: mode }),
  setIsGenerating: (val) => set({ isGenerating: val }),
  setIsIterating: (val) => set({ isIterating: val }),

  setVariants: (variants) =>
    set({ variants, selectedVariantId: null, canvasTab: "variants" }),

  selectVariant: (id) =>
    set({ selectedVariantId: id, canvasTab: "preview" }),

  getSelectedVariant: () => {
    const state = get();
    return (
      state.variants.find((v) => v.id === state.selectedVariantId) ?? null
    );
  },

  setCanvasTab: (tab) => set({ canvasTab: tab }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),

  addHistoryItem: (item) =>
    set((state) => ({ history: [item, ...state.history] })),

  restoreHistoryItem: (id) => {
    const state = get();
    const item = state.history.find((h) => h.id === id);
    if (item) {
      set({
        currentPrompt: item.prompt,
        variants: item.variants ?? [],
        selectedVariantId: item.selectedVariantId ?? null,
        canvasTab: item.variants?.length ? "variants" : "variants",
      });
    }
  },

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        { ...message, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),

  clearChat: () => set({ chatMessages: [] }),

  updateSelectedVariant: (updates) =>
    set((state) => ({
      variants: state.variants.map((v) =>
        v.id === state.selectedVariantId ? { ...v, ...updates } : v
      ),
    })),
}));
