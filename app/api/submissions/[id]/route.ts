// app/api/submissions/[id]/route.ts

import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/dbConnect"; // Adjust the import path as necessary
import Submission from "../../../../models/Submission"; // Adjust the import path as necessary
import { ObjectId } from "mongodb";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Connect to the database
    await dbConnect();

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Perform the delete operation
    const result = await Submission.deleteOne({ _id: new ObjectId(id) });

    // Check if the submission was deleted
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Submission deleted successfully" });
    } else {
      return NextResponse.json(
        { error: "Failed to delete submission" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
