import { NextRequest, NextResponse } from "next/server";
import https from "https";

// Ignore expired/self-signed certificates
// LOCAL DEVELOPMENT ONLY
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export async function POST(req: NextRequest) {
  try {
    // Read frontend request body
    const body = await req.json();

    // Extract owner name
    const owner = body.owner;

    // Validation
    if (!owner || owner.trim() === "") {
      return NextResponse.json(
        {
          error: "Owner name is required",
        },
        {
          status: 400,
        }
      );
    }

    // Call Kore backend API
    const response = await fetch(
      "https://localhost/admin/register-owner",
      {
        method: "POST",

        headers: {
          id: "admin",
          apikey:
            process.env.ADMIN_API_KEY || "",
          owner: owner,
        },

        // Ignore self-signed SSL certificate
        // LOCAL DEVELOPMENT ONLY
        agent: new https.Agent({
          rejectUnauthorized: false,
        }) as any,
      }
    );

    // Parse response from Kore backend
    const data = await response.json();
console.log("RAW BACKEND RESPONSE:", data);
    // Handle backend errors
    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error ||
            "Failed to register owner",
        },
        {
          status: response.status,
        }
      );
    }

    // Return success response
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "REGISTER OWNER API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}


// import { NextRequest, NextResponse } from "next/server";

// // Ignore expired/self-signed certificates
// // LOCAL DEVELOPMENT ONLY
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// export async function POST(req: NextRequest) {
//   try {
//     // Read frontend request
//     const body = await req.json();

//     const owner = body.owner;

//     // Validation
//     if (!owner || owner.trim() === "") {
//       return NextResponse.json(
//         {
//           error: "Owner name is required",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     // Call Kore backend
//     const response = await fetch(
//       "https://localhost/admin/register-owner",
//       {
//         method: "POST",

//         headers: {
//           id: "admin",
//           apikey:
//             process.env.ADMIN_API_KEY || "",
//           owner: owner,
//         },
//       }
//     );

//     // Parse backend response
//     const data = await response.json();

//     // Backend error handling
//     if (!response.ok) {
//       return NextResponse.json(
//         {
//           error:
//             data?.error ||
//             "Failed to register owner",
//         },
//         {
//           status: response.status,
//         }
//       );
//     }

//     // Success response
//     return NextResponse.json(data);
//   } catch (error: any) {
//     console.error(
//       "REGISTER OWNER API ERROR:",
//       error
//     );

//     return NextResponse.json(
//       {
//         error:
//           error.message ||
//           "Internal Server Error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }