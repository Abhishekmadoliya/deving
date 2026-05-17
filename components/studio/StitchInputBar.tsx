"use client";

import { useState, useRef, useEffect } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import {
  Plus,
  Slash,
  ImagePlus,
  Smile,
  Sparkles,
  ChevronDown,
  RefreshCcw,
  ArrowUp,
} from "lucide-react";

const SUGGESTION_CHIPS = [
  "Add a 'Terms of Service' link at the b...",
  "Change the card style to glassmorp...",
];

export function StitchInputBar({
  onSend,
}: {
  onSend: (prompt: string) => void;
}) {
  const { isGenerating, isIterating } = useDesignStore();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isGenerating || isIterating) return;
    onSend(input.trim());
    setInput("");
  };

  const isDisabled = !input.trim() || isGenerating || isIterating;

  return (
    <div className="stitch-input">
      {/* Suggestion chips */}
      <div className="stitch-input__chips">
        {SUGGESTION_CHIPS.map((chip, i) => (
          <button
            key={chip}
            className="stitch-input__chip"
            onClick={() => setInput(chip)}
          >
            {chip}
            <span className="stitch-input__chip-number">{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Input container */}
      <div className="stitch-input__container">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="What would you like to change or create?"
          rows={1}
          className="stitch-input__textarea"
        />

        {/* Bottom action row */}
        <div className="stitch-input__actions">
          {/* Left actions */}
          <div className="stitch-input__actions-left">
            <button className="stitch-input__action-icon" aria-label="Add">
              <Plus style={{ width: 16, height: 16 }} />
            </button>
            <button className="stitch-input__action-icon" aria-label="Command">
              <Slash style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* Right actions */}
          <div className="stitch-input__actions-right">
            <button className="stitch-input__action-icon" aria-label="Add image">
              <ImagePlus style={{ width: 16, height: 16 }} />
            </button>
            <button className="stitch-input__action-icon" aria-label="Emoji">
              <Smile style={{ width: 16, height: 16 }} />
            </button>

            {/* Model selector */}
            <button className="stitch-input__model-btn">
              <Sparkles
                style={{ width: 12, height: 12, color: "#6366f1" }}
              />
              <span>3 Flash</span>
              <ChevronDown style={{ width: 10, height: 10, color: "#555" }} />
            </button>

            {/* Refresh */}
            <button className="stitch-input__action-icon" aria-label="Refresh">
              <RefreshCcw style={{ width: 14, height: 14 }} />
            </button>

            {/* Submit */}
            <button
              className={`stitch-input__submit ${!isDisabled ? "stitch-input__submit--active" : ""}`}
              onClick={handleSubmit}
              disabled={isDisabled}
              aria-label="Send"
            >
              <ArrowUp style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
