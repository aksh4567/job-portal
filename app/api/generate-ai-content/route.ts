import { NextRequest, NextResponse } from "next/server";
import getGenerativeAIResponse from "@/scripts/aistudio";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await getGenerativeAIResponse(prompt);

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error) {
    console.error("[GENERATE_AI_CONTENT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
