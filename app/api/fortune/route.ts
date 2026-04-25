import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY 환경변수가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { year, month, day, hour } = body;

    if (!year || !month || !day || !hour) {
      return NextResponse.json(
        { error: "사주 데이터가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const prompt = `다음 사주 팔자에 대해 간단한 특징과 운세 해석을 해줘. 한국어로 자연스럽게 답변해줘.

연주: ${year.heavenlyStem}${year.earthlyBranch}
월주: ${month.heavenlyStem}${month.earthlyBranch}
일주: ${day.heavenlyStem}${day.earthlyBranch}
시주: ${hour.heavenlyStem}${hour.earthlyBranch}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
    });

    const fortune = completion.choices[0]?.message?.content ?? "운세 결과를 생성하지 못했습니다.";

    return NextResponse.json({ fortune });
  } catch (error) {
    console.error("/api/fortune error:", error);

    return NextResponse.json(
      { error: "운세 해석 실패" },
      { status: 500 }
    );
  }
}
