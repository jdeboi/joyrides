// app/api/submit/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Db, MongoClient } from "mongodb";

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
  const startTime = Date.now();
  try {
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

    if (!name || !email || !phone || !location) {
      console.error("Missing required fields");
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const client: MongoClient = await clientPromise;
    const db: Db = client.db("joyrides");
    const collection = db.collection("locations");

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
