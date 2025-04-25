import express from "express"
import { login, registerUser, verifyUser } from "../controllers/user.controller.js"



const router = express.Router()

router.post("/register", registerUser)
router.get("/verify/:token", verifyUser)
router.post("/me",isLoggedIn, getMe)
router.post("/login", login)
router.post("/login", login)
router.post("/login", login)


 

export default router