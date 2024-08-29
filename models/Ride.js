// models/Ride.js
import mongoose from "mongoose";

const RideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
});

const Ride = mongoose.models.Ride || mongoose.model("Ride", RideSchema);

export default Ride;