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
const db2 = process.env.DBNAME;
let db = conn.db(db2);
// console.log(db)

export default db;