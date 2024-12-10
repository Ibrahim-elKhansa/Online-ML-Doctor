import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.medications || !Array.isArray(body.medications)) {
      return NextResponse.json(
        { error: "Invalid request payload. 'medications' should be an array." },
        { status: 400 }
      );
    }

    const prompt = `Provide the approximate prices in USD for the following medications as a JSON array. Use specific brand names where available and include details for commonly known medications. For each item, include the medication name (preferably branded), type (e.g., cream, oral medication, spray, etc.), and price range. Format it as follows:
[
  {
    "name": "Brand Name or Specific Medication Name",
    "type": "Medication Type",
    "price": "Price Range"
  }
]
Here are the medications:
${body.medications.join("\n")}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const responseMessage = completion.choices[0]?.message?.content?.trim();

    if (!responseMessage) {
      return NextResponse.json({ error: "Failed to generate a response from OpenAI." }, { status: 500 });
    }

    const medicationDetails = JSON.parse(responseMessage);

    return NextResponse.json({ prices: medicationDetails }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/check-prices:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}
