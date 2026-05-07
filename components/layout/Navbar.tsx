"use client";

import { FileText, MessageCircle, MoreHorizontal, Gem } from "lucide-react";

/** Inline X (Twitter) logo — lucide-react doesn't export one */
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: 52,
        backgroundColor: "#0a0a0a",
        borderBottom: "1px solid #1a1a1a",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left — logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          Stitch
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#888",
            border: "1px solid #2a2a2a",
            borderRadius: 4,
            padding: "1px 6px",
            letterSpacing: "0.04em",
          }}
        >
          BETA
        </span>
      </div>

      {/* Right — actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* Docs */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "transparent",
            color: "#888",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
        >
          <FileText style={{ width: 15, height: 15 }} />
          Docs
        </button>

        {/* Chat bubble */}
        <button
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: "none",
            backgroundColor: "transparent",
            color: "#888",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
        >
          <MessageCircle style={{ width: 17, height: 17 }} />
        </button>

        {/* X / Twitter */}
        <button
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: "none",
            backgroundColor: "transparent",
            color: "#888",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
        >
          <XIcon />
        </button>

        {/* Gems / colorful icon */}
        <button
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: "none",
            backgroundColor: "transparent",
            color: "#a78bfa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "color 0.15s",
            position: "relative",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#a78bfa")}
        >
          <Gem style={{ width: 17, height: 17 }} />
          {/* notification dot */}
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#6366f1",
              border: "1px solid #0a0a0a",
            }}
          />
        </button>

        {/* Three-dot menu */}
        <button
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: "none",
            backgroundColor: "transparent",
            color: "#888",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
        >
          <MoreHorizontal style={{ width: 18, height: 18 }} />
        </button>

        {/* Avatar */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            marginLeft: 4,
            flexShrink: 0,
          }}
        >
          A
        </div>
      </div>
    </nav>
  );
}
