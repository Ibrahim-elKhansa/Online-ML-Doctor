import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const res = await fetch("https://eece-490-akinator-doctor.fly.dev/diagnose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Pass the received payload to the external API
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data); // Return the response from the external API
  } catch (error) {
    console.error("Error in serverless function:", error);
    return NextResponse.json({ error: "Serverless function failed." }, { status: 500 });
  }
}
