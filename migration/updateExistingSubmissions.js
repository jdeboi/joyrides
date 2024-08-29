// migration/updateExistingSubmissions.js

import mongoose from "mongoose";
import Submission from "../models/Submission"; // Adjust path if necessary

const MONGODB_URI = process.env.MONGODB_URI || "";

async function migrateSubmissions() {
  try {
    await mongoose.connect(MONGODB_URI, {});

    // Find all submissions (regardless of how they were created)
    const submissions = await Submission.find({});

    // Loop through each submission and update as needed
    for (const submission of submissions) {
      // Update submission fields if necessary
      // For example, if the 'createdAt' field was missing in older records
      if (!submission.createdAt) {
        submission.createdAt = new Date();
      }

      // If you're adding a 'ride' field, you might want to set a default value or leave it null
      if (!submission.ride) {
        submission.ride = null; // or set a default ride ID
      }

      // Save the updated submission
      await submission.save();
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateSubmissions();
