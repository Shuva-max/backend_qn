import express from "express";
import db from "../db.mjs";
// import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const COLL = process.env.COLL;

const router = express.Router();

let collection = await db.collection(COLL);

// test api get 
router.get("/", async (req, res) => {
  try {
    res.send({msg: "Hii... I am running fine"}).status(200);
    
  } catch (error) {
    res.status(500).json({msg: "Internal Server Error!!!", err: error});
  }
});

// Get a list of 50 posts RSET API
router.get("/questions", async (req, res) => {
  try {
    let results = await collection.find({})
      .limit(50)
      .toArray();
  
    console.log(results.length);  
    res.send(results).status(200);
    
  } catch (error) {
    res.status(500).json({msg: "Internal Server Error!!!", err: error});
  }
});

// Fetches the latest posts
router.get("/latest", async (req, res) => {
  try {
    let flag = false;
    let results = await collection.aggregate([
      {"$project": {"_id":1,"Subject_Name":1,"Subject_Code":1, "Dept_Name": 1, "Semester":1, "Year":1, "Exam_Type": 1, "dn_link":1}},
      {"$sort": {"Year": -1, "Sem_Type": -1}},
      {"$limit": 50}
    ]).toArray();
  
    console.log(results.length);  
    if(results.length!==0){
      flag=true;
      res.send({result: results, status:flag}).status(200);
    }
    
  } catch (error) {
    res.status(500).json({status: flag, msg: "Internal Server Error!!!", err: error});
  }
});

// filter path taking dept and semester as query parameter
router.get('/filter', async(req, res)=>{
  try {
    const dept = req.query.dept;
    const sem = parseInt(req.query.sem);
    
    console.log(dept, sem, typeof(sem))
    
    const results = await collection.aggregate([
        {$match: {Dept_Name: {$regex: dept, $options: "i"}, Semester: sem}},
        {$sort: {Year: -1}}
    ]).toArray();

    console.log(results.length)
    if(results.length !== 0){
      res.status(200).json(results)
    }else {
      res.status(204).send('No Result Found!!!');
    }
    
  } catch (error) {
    res.status(500).json({msg: "Internal Server Error!!!", err: error});
  }
})

// filter2 path taking dept, semester, exam_type, year as query parameter
router.get('/filter2', async(req, res)=>{
  let flag = "";
  try {
    const dept = req.query.dept;
    const sem = parseInt(req.query.sem);
    const year = parseInt(req.query.year);
    
    console.log(dept,typeof(dept), sem, typeof(sem), year, typeof(year))
    
    // console.log(year>2010)
    let results;
    if(year>2010) {
      results = await collection.aggregate([
          {$match: {Dept_Name: {$regex: dept, $options: "i"}, Semester: sem, Year: year}}
      ]).toArray();

    }else {
      results = await collection.aggregate([
        {$match: {Dept_Name: {$regex: dept, $options: "i"}, Semester: sem}}
    ]).toArray();
    
    }

    console.log(results.length)
    if(results.length !== 0){
      flag = 'OK';
      res.status(200).json({result: results, status: flag})
    }else {
      flag = "EMPTY";
      res.json({result:'No Result Found!!!', status: flag});
    }
    
  } catch (error) {
    flag = "ERROR";
    res.status(500).json({msg: "Internal Server Error!!!", err: error, status: flag});
  }
})

// filter2 path taking subject_name, dept, semester, exam_type, year as query parameter
router.get('/filter3', async(req, res)=>{
  let flag = "";
  try {
    const dept = req.query.dept;
    const xm_type = req.query.exam_type;
    const subj= req.query.subj;
    const subjC= req.query.subjCode;
    const sem = parseInt(req.query.sem);
    const year = parseInt(req.query.year);
    
    console.log(subj, subjC, dept, sem, typeof(sem), year, typeof(year), xm_type)
    
    const results = await collection.aggregate([
        {$match: {Subject_Name: {$regex: subj, $options: "i"}, Subject_Code: {$regex: subjC, $options: "i"}, Dept_Name: {$regex: dept, $options: "i"}, Semester: sem, Exam_Type: {$regex: xm_type, $options: "i"}, Year: year}}
    ]).toArray();

    console.log(results.length)
    if(results.length !== 0){
      flag = "OK";
      res.status(200).json({result: results, status: flag})
    }else {
      flag ="EMPTY"
      res.send({msg:'No Result Found!!!', status: flag});
    }
    
  } catch (error) {
    flag = "ERROR"
    res.status(500).json({msg: "Internal Server Error!!!", err: error, status: flag});
  }
})


export default router;
