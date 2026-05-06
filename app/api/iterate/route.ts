import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an expert UI developer. The user wants to modify an existing UI.
You will receive the current HTML/CSS and an edit instruction.

Return ONLY a valid JSON object:
{
  "html": "<updated complete HTML>",
  "css": "updated CSS",
  "description": "What was changed",
  "components": ["list", "of", "components"],
  "colors": ["#hex1", "#hex2"],
  "fonts": ["Font1", "Font2"]
}

Make surgical edits — only change what the user asked.
Maintain the overall design system and consistency.
The HTML must remain fully self-contained with embedded styles.
Include <script src="https://cdn.tailwindcss.com"></script> in the head.
Return ONLY the JSON, no markdown code fences, no extra text.`;

export async function POST(req: NextRequest) {
  try {
    const { currentHtml, currentCss, conversationHistory, editPrompt } =
      await req.json();

    if (!editPrompt) {
      return NextResponse.json(
        { error: "Edit prompt is required" },
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

    // Build conversation messages
    const messages: Anthropic.MessageParam[] = [];

    // Add previous conversation context if exists
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        });
      }
    }

    // Add current edit request
    messages.push({
      role: "user",
      content: `Current HTML:
\`\`\`html
${currentHtml}
\`\`\`

Current CSS:
\`\`\`css
${currentCss}
\`\`\`

Edit instruction: ${editPrompt}`,
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 16000,
      messages,
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

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Iterate API error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
