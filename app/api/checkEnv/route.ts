// app/api/checkEnv/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Ensure the path to mongodb file is correct

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      return NextResponse.json(
        { message: "MONGODB_URI is not set" },
        { status: 400 }
      );
    }

    // Attempt to connect to the database
    const client = await clientPromise;
    await client.connect(); // This will ensure connection

    return NextResponse.json({
      message: "Environment variables and database connection are working",
      mongoUriSet: !!mongoUri,
      databaseConnected: true,
    });
  } catch (error: any) {
    console.error(
      "Error checking environment variables or database connection:",
      error
    );
    return NextResponse.json(
      { message: "Error in environment setup", error: error.message },
      { status: 500 }
    );
  }
}
