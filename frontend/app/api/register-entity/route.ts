// import { NextRequest, NextResponse } from "next/server";
// import https from "https";

// export async function POST(req: NextRequest) {
//   try {

//      // 🔥 DUMMY ENTITY SCHEMA (replace later with real one)
//     const entitySchema = {
//       refCatalogueSchema: "generic_iotdevice_schema.json",
//       resourceType: "streetlight",
//       tags: ["demo", "test", "iot"],
//       refCatalogueSchemaRelease: "0.1.0",

//       latitude: {
//         value: 13.0143335,
//         ontologyRef: "http://www.w3.org/2003/01/geo/wgs84_pos#",
//       },

//       longitude: {
//         value: 77.5678424,
//         ontologyRef: "http://www.w3.org/2003/01/geo/wgs84_pos#",
//       },

//       owner: {
//         name: "Demo Owner",
//         website: "http://example.com",
//       },

//       provider: {
//         name: "Demo Provider",
//         website: "http://example.com",
//       },

//       geoLocation: {
//         address: "Mumbai, India",
//       },

//       data_schema: {
//         type: "object",
//         properties: {
//           temperature: {
//             type: "number",
//             units: "C",
//           },
//           power: {
//             type: "number",
//             units: "watts",
//           },
//         },
//         additionalProperties: false,
//       },

//       serialization_from_device: {
//         format: "protocol-buffers",
//       },

//       serialization_to_device: {
//         format: "protocol-buffers",
//       },
//     };

//     const body = await req.json().catch(() => ({}));
//     console.log("REGISTER ENTITY API REQUEST BODY:", body);
//     const response = await fetch(
//       "https://localhost/owner/register-entity",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",

//           id: body.ownerId || "ajinkya",
//           apikey: process.env.NEHA_OWNER_API_KEY || "",
//           entity:body.name || "Demo Streetlight",
//         },

//        body: JSON.stringify({
//           entitySchema,
//         }),

//         agent: new https.Agent({
//           rejectUnauthorized: false,
//         }) as any,
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: data?.error || "Failed to register entity" },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("REGISTER ENTITY REQUEST:", body);

    const entitySchema = {
      refCatalogueSchema: "generic_iotdevice_schema.json",
      resourceType: "streetlight",
      tags: ["demo", "test", "iot"],
      refCatalogueSchemaRelease: "0.1.0",

      latitude: {
        value: 13.0143335,
        ontologyRef: "http://www.w3.org/2003/01/geo/wgs84_pos#",
      },

      longitude: {
        value: 77.5678424,
        ontologyRef: "http://www.w3.org/2003/01/geo/wgs84_pos#",
      },

      owner: {
        name: "Demo Owner",
        website: "http://example.com",
      },

      provider: {
        name: "Demo Provider",
        website: "http://example.com",
      },

      geoLocation: {
        address: "Mumbai, India",
      },

      data_schema: {
        type: "object",
        properties: {
          temperature: { type: "number", units: "C" },
          power: { type: "number", units: "watts" },
        },
        additionalProperties: false,
      },

      serialization_from_device: {
        format: "protocol-buffers",
      },

      serialization_to_device: {
        format: "protocol-buffers",
      },
    };

    // 🔥 FIX TLS ERROR (IMPORTANT)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const response = await fetch(
      "https://localhost/owner/register-entity",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          id: body.ownerId,
          apikey: process.env.ARATI_OWNER_API_KEY,
          entity: body.name,
        },

        body: JSON.stringify({
          entitySchema,
        }),
      }
    );

    const data = await response.json();

    console.log("BACKEND RESPONSE:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to register entity" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("REGISTER ENTITY ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}