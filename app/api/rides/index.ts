// pages/api/rides/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Ride from "../../../models/Ride";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { name, description } = req.body;
      const newRide = new Ride({ name, description });
      await newRide.save();
      res.status(201).json(newRide);
    } catch (error) {
      console.error("Error creating ride:", error);
      res.status(500).json({ error: "Failed to create ride" });
    }
  } else if (req.method === "GET") {
    try {
      const rides = await Ride.find({});
      res.status(200).json(rides);
    } catch (error) {
      console.error("Error fetching rides:", error);
      res.status(500).json({ error: "Failed to fetch rides" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
