import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";

//import all routes
import userRoutes from "./routes/user.route.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hi , This is Home Page");
});
app.get("/abhijit", (req, res) => {
  res.send("Hi , This is Abhijit");
});


app.post("/test", (req, res) => {
  console.log("Test body:", req.body);
  res.json({ received: req.body });
});


//connect to db
db();

app.use("/api/v1/users", userRoutes)

app.listen(port, () => {
  console.log(`✔️  Server is running on port: ${port}`);
});
