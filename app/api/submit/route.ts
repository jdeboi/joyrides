import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Make sure this path is correct
import { Db, MongoClient } from "mongodb";

// Define a TypeScript interface for the incoming request data
interface SubmitRequestBody {
  name: string;
  phone: string;
  email: string;
  title: string;
  description: string;
  searchDescription: string;
  location: {
    lat: number;
    lng: number;
  };
}

export async function POST(request: Request) {
  try {
    // Parse the request body as JSON
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

    // Get the MongoDB client and database
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("joyrides");
    const collection = db.collection("locations");

    // Insert the document into the database
    const result = await collection.insertOne({
      name,
      phone,
      email,
      title,
      description,
      searchDescription,
      location,
      createdAt: new Date(),
    });

    console.log("Insert result:", result);

    // Return a success response
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
