import { MongoClient } from "mongodb";

const CONN_URI = process.env.MONGODB_URL_COLLECTION!;

const options = {};

let client: any;

let clientPromise: Promise<MongoClient>;

if (!CONN_URI) {
    throw new Error("Please check the MongoDB connection URI");
}

client = new MongoClient(CONN_URI, options);



client.connect().then(() => console.log("Connected to MongoDB")).catch(console.error);

clientPromise = await client.connect();


export default clientPromise;

