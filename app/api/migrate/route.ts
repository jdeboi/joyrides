// app/api/migrate/route.ts
import { NextResponse } from "next/server";
import Submission from "../../../models/Submission";
import dbConnect from "../../../utils/dbConnect";

export async function POST(request: Request) {
  console.log("Request method:", request.method);

  // Parse the request body (if any) — for a migration, you might not need any specific body content
  // const body = await request.json();
  // console.log("Request body:", body);

  try {
    // Connect to the database
    await dbConnect();

    // Find all submissions
    const submissions = await Submission.find({});
    for (const submission of submissions) {
      let updated = false;

      // Add missing fields
      if (!submission.createdAt) {
        submission.createdAt = new Date();
        updated = true;
      }

      if (!submission.ride) {
        submission.ride = null;
        updated = true;
      }

      if (updated) {
        console.log("Updated submission:", submission);
        await submission.save();
      }
    }

    return NextResponse.json({ message: "Migration completed successfully" });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { message: "Migration failed", error: error.message },
      { status: 500 }
    );
  }
}
