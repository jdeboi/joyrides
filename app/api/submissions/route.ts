// app/api/submissions/route.ts
import { NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect"; // Adjust the import path as necessary
import Submission from "../../../models/Submission"; // Adjust the import path as necessary

// GET method to fetch all submissions
export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all submissions
    const data = await Submission.find({}).lean();

    // Return the fetched submissions
    return NextResponse.json({ submissions: data });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// If you need a POST handler to add new submissions
export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, description, location } = await request.json();
    const newSubmission = new Submission({ name, description, location });

    await newSubmission.save();

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
