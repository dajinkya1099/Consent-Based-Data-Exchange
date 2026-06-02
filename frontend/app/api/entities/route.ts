import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ownerId } = await req.json();

    console.log("OWNER ENTITIES API REQUEST - ownerId:", ownerId);
    if (!ownerId) {
      return NextResponse.json(
        { error: "ownerId required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      "https://localhost/owner/entities",
      {
        method: "GET",
        headers: {
          id: ownerId,
          apikey: process.env.NEHA_OWNER_API_KEY || "",
        },
      }
    );

    const data = await res.json();
    console.log("OWNER ENTITIES API RESPONSE:", data);
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch entities" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}