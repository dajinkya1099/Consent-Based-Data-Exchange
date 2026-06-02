import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const apikey = searchParams.get("apikey");
    const entity = searchParams.get("entity");

    if (!id || !apikey) {

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
      "Content-Type": "application/json",
    };

    // Optional entity header
    if (entity) {
      headers["entity"] = entity;
    }

    const response = await fetch(
      "https://localhost/entity/follow-status",
      {
        method: "GET",
        headers,
      }
    );

    const text = await response.text();

    console.log("FOLLOW STATUS BACKEND RESPONSE:", text);

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

    console.error("FOLLOW STATUS ERROR:", err);

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