import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();

    const {
      id,
      apikey,
      to,
      permission,
      validity,
      topic,
      messageType,
      from,
    } = body;
console.log("FOLLOW API REQUEST - body:", body);
    if (
      !id ||
      !apikey ||
      !to ||
      !permission ||
      !validity ||
      !topic
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // 🔥 Ignore localhost SSL issue
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const headers: Record<string, string> = {
      id,
      apikey,
      to,
      permission,
      validity,
      topic,
      "message-type": messageType,
      "Content-Type": "application/json",
    };

    // Optional "from"
    if (from) {
      headers["from"] = from;
    }

    const response = await fetch(
      "https://localhost/entity/follow",
      {
        method: "POST",
        headers,
      }
    );

    const text = await response.text();

    console.log("FOLLOW BACKEND RESPONSE:", text);

    let result;

    try {
      result = JSON.parse(text);

    } catch {
      result = {
        raw: text,
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: result,
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json(result);

  } catch (err: any) {

    console.error("FOLLOW ERROR:", err);

    return NextResponse.json(
      {
        error: err.message || "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}