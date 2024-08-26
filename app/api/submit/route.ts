// app/api/submit/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  const {
    name,
    phone,
    email,
    title,
    description,
    searchDescription,
    location,
  } = await request.json();

  if (!name || !email || !phone || !location) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("joyrides"); // Use your database name here

    // Check if the collection exists; create it if not
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    if (!collectionNames.includes("locations")) {
      await db.createCollection("locations");
    }

    const collection = db.collection("locations"); // Collection name

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

    return NextResponse.json({
      message: "Form data saved successfully",
      result,
    });
  } catch (error) {
    console.error("Error saving form data:", error);
    return NextResponse.json(
      { message: "Error saving form data", error },
      { status: 500 }
    );
  }
}
