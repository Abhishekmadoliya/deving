"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { MessageSquare, ChevronDown, Sparkles } from "lucide-react";

export function ConversationSidebar({ isOpen }: { isOpen: boolean }) {
  const { chatMessages, isGenerating, isIterating } = useDesignStore();

  return (
    <div
      className="stitch-sidebar"
      style={{
        // width: isOpen ? 260 : 0,
        // minWidth: isOpen ? 260 : 0,
        // opacity: isOpen ? 1 : 0,
        // overflow: "hidden",
        // transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
      }}
    >
      {/* Chat icon header */}
      <div className="stitch-sidebar__header">
        <div className="stitch-sidebar__chat-icon">
          <MessageSquare style={{ width: 16, height: 16 }} />
        </div>
      </div>

      {/* Conversation entries */}
      <div className="stitch-sidebar__messages">
        {chatMessages.map((msg) => (
          <div key={msg.id} className="stitch-sidebar__entry">
            {msg.role === "user" ? (
              <div className="stitch-sidebar__entry-row">
                <div className="stitch-sidebar__entry-avatar stitch-sidebar__entry-avatar--user">
                  A
                </div>
                <div className="stitch-sidebar__entry-content">
                  <span className="stitch-sidebar__entry-label">
                    {msg.content.length > 28
                      ? msg.content.substring(0, 28) + "..."
                      : msg.content}
                  </span>
                  <ChevronDown
                    style={{ width: 12, height: 12, color: "#555", flexShrink: 0 }}
                  />
                </div>
              </div>
            ) : (
              <p className="stitch-sidebar__entry-text">{msg.content}</p>
            )}
          </div>
        ))}

        {/* Loading */}
        {(isGenerating || isIterating) && (
          <div className="stitch-sidebar__entry">
            <div className="stitch-sidebar__loading">
              <div className="stitch-sidebar__loading-dots">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="stitch-sidebar__loading-dot"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 12, color: "#555" }}>
                {isGenerating ? "Generating..." : "Updating..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
