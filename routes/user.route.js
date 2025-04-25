import express from "express";
import {
  login,
  registerUser,
  verifyUser,
  getMe,
  logoutUser
} from "../controllers/user.controller.js";

import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", login);
router.get("/me", isLoggedIn, getMe);

// router.post("/login", login)
// router.post("/login", login)

export default router;
