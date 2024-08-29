// app/api/submit/route.ts
import { NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect"; // Ensure path is correct
import Submission from "../../../models/Submission"; // Ensure path is correct

interface SubmitRequestBody {
  name: string;
  phone: string;
  email: string;
  title?: string;
  description?: string;
  searchDescription?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // Parse the incoming request body
    const data: SubmitRequestBody = await request.json();
    console.log("Received data:", data);

    const {
      name,
      phone,
      email,
      title,
      description,
      searchDescription,
      location,
    } = data;

    // Validate required fields
    if (!name || !email || !phone || !location) {
      console.error("Missing required fields");
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Create a new submission document using the Mongoose model
    const newSubmission = new Submission({
      name,
      phone,
      email,
      title,
      description,
      searchDescription,
      location,
    });

    // Save the submission document to the database
    const result = await newSubmission.save();

    console.log("Insert result:", result);

    const endTime = Date.now();
    console.log(`Function executed in ${endTime - startTime} ms`);

    return NextResponse.json({
      message: "Form data saved successfully",
      result,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error saving form data", error: error.message },
      { status: 500 }
    );
  }
}
