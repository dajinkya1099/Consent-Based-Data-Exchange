import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const {
      id,
      apikey,
      to,
      topic,
      messageType,
      from,
    } = body;
    console.log("BIND API REQUEST - body:", body);
console.log("BIND API REQUEST - body:", body);
    if (!id || !apikey || !to || !topic || !messageType || !from) {

      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fix localhost SSL issues
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const response = await fetch(
      "https://localhost/entity/bind",
      {
        method: "POST",
        headers: {
          id,
          apikey,
          to,
          topic,
          "message-type": messageType,
          from,
          "Content-Type": "application/json",
        },
      }
    );

    const text = await response.text();

    console.log("BIND BACKEND RESPONSE:", text);

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

    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}