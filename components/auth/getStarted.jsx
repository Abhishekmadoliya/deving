"use client";
import React from "react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

const GetStarted = () => {
  function registerwithgoogle() {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
      state: "cdlxkcn;l",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 52px)",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
        color: "#ededed",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: 440,
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Heading */}
          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Get started with{" "}
            <span style={{ fontWeight: 600 }}>Stitch.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 15,
              color: "#666",
              textAlign: "center",
              marginBottom: 28,
              lineHeight: 1.5,
              maxWidth: 340,
            }}
          >
            Sign in to start designing beautiful interfaces with AI.
          </p>

          {/* Auth card */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: 16,
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: "#888",
                marginBottom: 4,
              }}
            >
              Continue with your account
            </p>

            {/* Google OAuth button */}
            <button
              onClick={registerwithgoogle}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "12px 20px",
                borderRadius: 10,
                border: "1px solid #2a2a2a",
                backgroundColor: "#fff",
                color: "#000",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                lineHeight: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
                e.currentTarget.style.borderColor = "#444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.borderColor = "#2a2a2a";
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
              }}
            >
              <div
                style={{ flex: 1, height: 1, backgroundColor: "#1a1a1a" }}
              />
              <span style={{ fontSize: 12, color: "#444" }}>or</span>
              <div
                style={{ flex: 1, height: 1, backgroundColor: "#1a1a1a" }}
              />
            </div>

            {/* Email input (placeholder for future) */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                type="email"
                placeholder="Enter your email address"
                disabled
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #1a1a1a",
                  backgroundColor: "#0a0a0a",
                  color: "#ededed",
                  fontSize: 14,
                  outline: "none",
                  opacity: 0.5,
                  cursor: "not-allowed",
                  boxSizing: "border-box",
                }}
              />
              <span style={{ fontSize: 11, color: "#444", textAlign: "center" }}>
                Email sign-in coming soon
              </span>
            </div>
          </div>

          {/* Terms */}
          <p
            style={{
              fontSize: 12,
              color: "#444",
              textAlign: "center",
              marginTop: 16,
              lineHeight: 1.6,
              maxWidth: 320,
            }}
          >
            By continuing, you agree to Stitch&apos;s{" "}
            <span style={{ color: "#888", cursor: "pointer" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span style={{ color: "#888", cursor: "pointer" }}>
              Privacy Policy
            </span>
            .
          </p>


        </div>
      </div>
    </main>
  );
};

export default GetStarted;
