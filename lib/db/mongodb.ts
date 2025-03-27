import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hrms";
const DB_NAME = "hrms"; // Explicitly define DB name

declare global {
  var mongoClient: MongoClient | null;
  var mongoDb: Db | null;
}

// Use global scope to avoid multiple connections in dev mode
global.mongoClient = global.mongoClient || null;
global.mongoDb = global.mongoDb || null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (global.mongoClient && global.mongoDb) {
    return { client: global.mongoClient, db: global.mongoDb };
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    // Cache the connection globally
    global.mongoClient = client;
    global.mongoDb = db;

    return { client, db };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

// Helper function to get a collection
export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

// Collection names
export const Collections = {
  USERS: "users",
  JOB_LISTINGS: "jobListings",
  CANDIDATES: "candidates",
  APPLICATIONS: "applications",
  INTERVIEWS: "interviews",
};
