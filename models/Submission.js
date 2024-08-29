// models/Submission.js
import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    searchDescription: { type: String },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" }, // Reference to Ride
    createdAt: { type: Date, default: Date.now }, // Automatically set createdAt to the current date
  },
  { collection: "locations" }
);

const Submission =
  mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);

export default Submission;
