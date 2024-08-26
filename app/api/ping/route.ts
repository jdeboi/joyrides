// app/api/ping/route.ts
import { NextResponse } from "next/server";

// test ping
export async function GET() {
  return NextResponse.json({ message: "API is working!" });
}
