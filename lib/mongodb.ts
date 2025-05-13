import { MongoClient } from "mongodb";

const CONN_URI = process.env.MONGODB_URL_COLLECTION!;

const options = {};

if (!CONN_URI) {
    throw new Error("Please check the MongoDB connection URI");
}
const client = new MongoClient(CONN_URI, options);

const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;

