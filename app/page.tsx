"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  ArrowUp,
  Plus,
  Monitor,
  Smartphone,
  MessageCircle,
  ChevronDown,
  BarChart3,
  FileText,
  Search,
  Users,
  Clock,
  Grid3X3,
} from "lucide-react";

const EXAMPLE_PROMPTS = [
  "A mobile fitness tracking app",
  "E-commerce product page with cart",
  "Admin dashboard with tables and charts",
  "Landing page for a SaaS startup",
];

const RECENT_PROJECTS = [
  { name: "Main Dashboard", date: "Apr 22, 2026", shared: true },
  { name: "Home Lookbook", date: "Apr 20, 2026", shared: true },
  { name: "Vertical Feed", date: "Apr 18, 2026", shared: false },
  { name: "Dashboard", date: "Apr 15, 2026", shared: true },
];

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"standard" | "experimental">("standard");
  const [activeTab, setActiveTab] = useState<"projects" | "shared">("projects");
  const [designType, setDesignType] = useState<"web" | "app">("web");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const params = new URLSearchParams({
      prompt: prompt.trim(),
      mode,
    });
    router.push(`/studio?${params.toString()}`);
  };

  const handleChipClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "#ededed",
      }}
    >
      {/* <aside
        style={{
          width: 280,
          minWidth: 280,
          borderRight: "1px solid #1a1a1a",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          backgroundColor: "#0a0a0a",
        }}
      >
        <div
          style={{
            padding: "20px 20px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Zap
            style={{ width: 20, height: 20, color: "#6366f1", flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            Stitch
          </span>
          <span
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 20,
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#888",
              fontWeight: 500,
            }}
          >
            BETA
          </span>
        </div>

        <div
          style={{
            padding: "0 12px",
            display: "flex",
            gap: 4,
          }}
        >
          <button
            onClick={() => setActiveTab("projects")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              backgroundColor:
                activeTab === "projects" ? "#1a1a1a" : "transparent",
              color: activeTab === "projects" ? "#fff" : "#666",
            }}
          >
            <Grid3X3 style={{ width: 14, height: 14 }} />
            My projects
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              backgroundColor:
                activeTab === "shared" ? "#1a1a1a" : "transparent",
              color: activeTab === "shared" ? "#fff" : "#666",
            }}
          >
            <Users style={{ width: 14, height: 14 }} />
            Shared with me
          </button>
        </div>

        <div style={{ padding: "12px 16px 8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 10,
              backgroundColor: "#111",
              border: "1px solid #1e1e1e",
              color: "#555",
              fontSize: 13,
            }}
          >
            <Search style={{ width: 14, height: 14, flexShrink: 0 }} />
            <span>Search projects</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 8px",
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 500,
              padding: "8px 12px 6px",
            }}
          >
            Recent
          </p>
          {RECENT_PROJECTS.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
            >
              <button
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#141414")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BarChart3 style={{ width: 14, height: 14, color: "#555" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#ccc",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {project.name}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      color: "#555",
                      marginTop: 2,
                    }}
                  >
                    <Clock style={{ width: 10, height: 10 }} />
                    <span>{project.date}</span>
                    {project.shared && (
                      <>
                        <span>·</span>
                        <Users style={{ width: 10, height: 10 }} />
                        <span>Shared</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </aside> */}

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
            {EXAMPLE_PROMPTS.map((example) => (
              <button
                key={example}
                onClick={() => handleChipClick(example)}
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

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              borderRadius: 16,
              border: "1px solid #1e1e1e",
              backgroundColor: "#111",
              overflow: "hidden",
            }}
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleGenerate();
                }
              }}
              placeholder="What would you like to design?"
              rows={4}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                padding: "20px 22px 8px",
                fontSize: 15,
                color: "#fff",
                border: "none",
                resize: "none",
                outline: "none",
                lineHeight: 1.6,
                fontFamily: "inherit",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderTop: "1px solid #1a1a1a",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: "transparent",
                    color: "#555",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Plus style={{ width: 18, height: 18 }} />
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#1a1a1a",
                    borderRadius: 10,
                    padding: 3,
                    marginLeft: 4,
                  }}
                >
                  <button
                    onClick={() => setDesignType("app")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      backgroundColor:
                        designType === "app" ? "#252525" : "transparent",
                      color: designType === "app" ? "#fff" : "#666",
                    }}
                  >
                    <Smartphone style={{ width: 13, height: 13 }} />
                    App
                  </button>
                  <button
                    onClick={() => setDesignType("web")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      backgroundColor:
                        designType === "web" ? "#252525" : "transparent",
                      color: designType === "web" ? "#fff" : "#666",
                    }}
                  >
                    <Monitor style={{ width: 13, height: 13 }} />
                    Web
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: "transparent",
                    color: "#555",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <MessageCircle style={{ width: 18, height: 18 }} />
                </button>

                <button
                  onClick={() =>
                    setMode(mode === "standard" ? "experimental" : "standard")
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 14px",
                    borderRadius: 10,
                    border: "none",
                    backgroundColor: "#1a1a1a",
                    color: "#ccc",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Sparkles
                    style={{ width: 14, height: 14, color: "#6366f1" }}
                  />
                  {mode === "standard" ? "Standard" : "Experimental"}
                  <ChevronDown
                    style={{ width: 12, height: 12, color: "#555" }}
                  />
                </button>

                <div
                  style={{
                    width: 1,
                    height: 22,
                    backgroundColor: "#222",
                  }}
                />

                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: "none",
                    backgroundColor: prompt.trim() ? "#6366f1" : "#1a1a1a",
                    color: prompt.trim() ? "#fff" : "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: prompt.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                  }}
                >
                  <ArrowUp style={{ width: 18, height: 18 }} />
                </button>
              </div>
            </div>
          </motion.div>

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
