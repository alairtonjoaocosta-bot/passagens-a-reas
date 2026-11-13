import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "AeroSearch Flights Search API endpoint",
    version: "1.0.0"
  });
}

