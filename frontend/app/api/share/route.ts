import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const {
      id,
      apikey,
      followId,
    } = body;

    if (!id || !apikey || !followId) {

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

    const response = await fetch(
      "https://localhost/entity/share",
      {
        method: "POST",

        headers: {
          id,
          apikey,
          "follow-id": followId,
          "Content-Type": "application/json",
        },
      }
    );

    const text = await response.text();

    console.log("SHARE BACKEND RESPONSE:", text);

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

    console.error("SHARE ERROR:", err);

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