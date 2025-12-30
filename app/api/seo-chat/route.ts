import { NextRequest, NextResponse } from "next/server";

// Proxies SEO chat requests to the configured backend
export async function POST(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_N8N_SEO_CHAT_URL;

    if (!apiUrl) {
      return NextResponse.json(
        {
          error:
            "SEO Chat API URL not configured. Please set N8N_SEO_CHAT_API_URL.",
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    const question = body?.question;

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "question is required" },
        { status: 400 }
      );
    }

    const upstream = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "SEO Chat upstream error", details: data },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data ?? { output: null });
  } catch (error) {
    console.error("SEO Chat proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
