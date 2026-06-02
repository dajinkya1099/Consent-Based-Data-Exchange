// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {

//   try {

//     const { searchParams } = new URL(req.url);

//     const id = searchParams.get("id");
//     const apikey = searchParams.get("apikey");
//     const messageType = searchParams.get("messageType") || "";
//     const numMessages = searchParams.get("numMessages") || "";

//     if (!id || !apikey) {

//       return NextResponse.json(
//         { error: "Missing id or apikey" },
//         { status: 400 }
//       );
//     }

//     // Fix SSL issue for localhost
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//     const headers: Record<string, string> = {
//       id,
//       apikey,
//     };

//     // optional headers (MATCH PYTHON LOGIC EXACTLY)
//     if (messageType) {
//       headers["message-type"] = messageType;
//     }

//     if (numMessages) {
//       headers["num-messages"] = numMessages;
//     }

//     const response = await fetch(
//       "https://localhost/entity/subscribe",
//       {
//         method: "GET",
//         headers,
//       }
//     );

//     const text = await response.text();

//     console.log("SUBSCRIBE BACKEND RESPONSE:", text);

//     let result;

//     try {
//       result = JSON.parse(text);
//     } catch {
//       result = { raw: text };
//     }

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: result },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(result);

//   } catch (err: any) {

//     return NextResponse.json(
//       { error: err.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const apikey = searchParams.get("apikey");
    const messageType = searchParams.get("messageType");
    const numMessages = searchParams.get("numMessages");

    if (!id || !apikey) {
      return NextResponse.json(
        { error: "Missing id or apikey" },
        { status: 400 }
      );
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const headers: Record<string, string> = {
      id,
      apikey,
    };

    // ✅ FIX: correct backend header names
    if (messageType) {
      headers["message-type"] = messageType;
    }

    if (numMessages) {
      headers["num-messages"] = numMessages;
    }

    const response = await fetch(
      "https://localhost/entity/subscribe",
      {
        method: "GET",
        headers,
      }
    );

    const text = await response.text();

    console.log("RAW BACKEND RESPONSE:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }

    return NextResponse.json(result, {
      status: response.status,
    });

  } catch (err: any) {

    console.error("SUBSCRIBE ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}