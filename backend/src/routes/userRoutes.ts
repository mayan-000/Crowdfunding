import dotenv from "dotenv";
import express from "express";

import { getUser, registerUser } from "../controllers/userController";

dotenv.config();

const router = express.Router();

router.post("/register", registerUser);
router.get("/:address", getUser);
