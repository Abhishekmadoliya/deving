import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an expert UI designer and frontend developer. 
Generate 3 distinct UI design variants as HTML + CSS.

Return ONLY a valid JSON object with this exact structure:
{
  "variants": [
    {
      "id": "variant-1",
      "label": "Variant 1 - [descriptive name]",
      "description": "Brief description of this variant's style",
      "html": "<complete self-contained HTML with inline or embedded CSS>",
      "css": "extracted CSS as a separate string",
      "components": ["Navbar", "Sidebar", "Card", "Chart"],
      "colors": ["#6366f1", "#1a1a2e", "#ffffff"],
      "fonts": ["Inter", "system-ui"]
    }
  ]
}

Rules:
- Generate exactly 3 variants with ids variant-1, variant-2, variant-3
- Each HTML must be fully self-contained (include <style> tags)
- Use modern, clean design with good typography
- Use CSS variables for theming
- Make it visually impressive and production-quality
- No placeholder lorem ipsum — use realistic content
- Include subtle shadows, gradients, and micro-details
- Include this in the HTML <head>: <script src="https://cdn.tailwindcss.com"></script>
- Each variant should have a distinctly different visual approach
- Return ONLY the JSON, no markdown code fences, no extra text`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, mode } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const userPrompt =
      mode === "experimental"
        ? `Create an innovative, cutting-edge UI for: ${prompt}. Push design boundaries with creative layouts, bold colors, and unique interactions. Be experimental and surprising.`
        : `Create a professional, polished UI for: ${prompt}. Focus on usability, clean design, and modern aesthetics.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 16000,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { error: "No text response from AI" },
        { status: 500 }
      );
    }

    let responseText = textContent.text.trim();

    // Strip markdown code fences if present
    if (responseText.startsWith("```")) {
      responseText = responseText
        .replace(/^```(?:json)?\s*\n?/, "")
        .replace(/\n?```\s*$/, "");
    }

    const parsed = JSON.parse(responseText);

    return NextResponse.json({ variants: parsed.variants });
  } catch (error: unknown) {
    console.error("Generate API error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
