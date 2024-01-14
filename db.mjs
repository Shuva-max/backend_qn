import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE || "";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log("successfully connected to Mongo");
} catch(e) {
  console.error(e);
}

let db = conn.db("Clg_Qn_DB");

export default db;