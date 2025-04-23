import express from "express";
import dotenv from "dotenv"
import cors from "cors"


dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send("Hi , This is Home Page")
})


// console.log(process.env.PORT);


app.listen(port, ()=>{
    console.log(`✔️  Server is running on port :${port}`);
    
})