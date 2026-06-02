import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      apikey,
      to,
      subject,
      messageType,
      data,
    } = body;
console.log("PUBLISH API REQUEST - body:", body);
    if (!id || !apikey || !to) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔥 IMPORTANT (for localhost SSL issues)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const response = await fetch(
      "https://localhost/entity/publish",
      {
        method: "POST",
        headers: {
          id,
          apikey,
          to,
          subject,
          "message-type": messageType,
          "Content-Type": "text/plain",
        },

        body: JSON.stringify(data),
      }
    );

    const text = await response.text();

    console.log("PUBLISH BACKEND RESPONSE:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: result },
        { status: response.status }
      );
    }

    return NextResponse.json(result);

  } catch (err: any) {
    console.error("PUBLISH ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}