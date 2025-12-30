import { NextResponse, type NextRequest } from "next/server";
import type { ClothingItem } from "@/lib/mockData";

type OutfitAIRequest = {
  message: string;
  wardrobe: ClothingItem[];
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY on server" },
      { status: 500 }
    );
  }

  let body: OutfitAIRequest;
  try {
    body = (await req.json()) as OutfitAIRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = body.message?.trim();
  const wardrobe = Array.isArray(body.wardrobe) ? body.wardrobe : [];

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const wardrobeCompact = wardrobe.map((i) => ({
    id: i.id,
    name: i.name,
    category: i.category,
    color: i.color,
    style: i.style,
  }));

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a wardrobe stylist assistant. You must ONLY use items from the provided wardrobe list. " +
            "Return STRICT JSON with keys: paletteAdvice (string), outfits (array of 3), and notes (array of strings). " +
            "Each outfit: { title: string, itemIds: string[], reason: string, colorStory: string }. " +
            "itemIds must be from wardrobe. Keep reasons concise.",
        },
        {
          role: "user",
          content: JSON.stringify({
            userMessage: message,
            wardrobe: wardrobeCompact,
          }),
        },
      ],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    return NextResponse.json(
      { error: "AI request failed", status: resp.status, detail: text },
      { status: 500 }
    );
  }

  const data = (await resp.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content ?? "{}";
  return NextResponse.json({ content });
}
