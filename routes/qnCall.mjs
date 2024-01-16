import express from "express";
import db from "../db.mjs";
// import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const COLL = process.env.Test3;

const router = express.Router();

let collection = await db.collection(COLL);

// test api get 
router.get("/", async (req, res) => {
  res.send("Hii... I am running fine").status(200);
});

// Get a list of 50 posts RSET API
router.get("/questions", async (req, res) => {
  let results = await collection.find({})
    .limit(50)
    .toArray();

  console.log(results.length);  
  res.send(results).status(200);
});

// Fetches the latest posts
router.get("/latest", async (req, res) => {
  let results = await collection.aggregate([
    {"$project": {"_id":0,"Subject_Name":1,"Subject_Code":1, "Dept_Name": 1, "Semester":1, "Year":1, "Exam_Type": 1, "PDF_Link": 1, "dn_link":1}},
    {"$sort": {"Year": -1}},
    {"$limit": 50}
  ]).toArray();

  console.log(results.length);  
  res.send(results).status(200);
});

// 
router.get('/filter', async(req, res)=>{
    const dept = req.query.dept;
    const sem = req.query.sem;
    const iSem = parseInt(sem, 10);
    console.log(dept, sem)
    
    const results = await collection.aggregate([
        {$match: {Dept_Name: {$regex: dept, $options: "i"}, Semester: iSem}},
        {$sort: {Year: -1}},
        {$limit: 10}
    ]).toArray();

    console.log(results.length)
    res.json(results).status(200)
})


export default router;
