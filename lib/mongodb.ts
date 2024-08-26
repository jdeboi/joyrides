// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

// Declare a global variable for the MongoDB client promise to avoid creating multiple instances
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

// Ensure the environment variable is set
if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// Set up MongoDB client and promise based on environment
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the MongoClient is not recreated each time
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri!, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri!, options);
  clientPromise = client.connect();
}

// Export the client promise with a consistent type
export default clientPromise;
