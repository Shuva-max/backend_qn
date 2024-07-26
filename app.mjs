import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import qnCall from './routes/qnCall.mjs'
import db from './db.mjs';

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

//Available routes
// app.use('/api/notes', require('./routes/notes'));
app.use("/qn", qnCall);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});