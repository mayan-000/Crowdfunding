import dotenv from "dotenv";
import express from "express";

import {
  getAllUser,
  getUser,
  getUserContributions,
  registerUser,
} from "../controllers/userController";

dotenv.config();

const userRouter = express.Router();

userRouter.get("/:address", getUser);
userRouter.get("/all", getAllUser);
userRouter.get("/:address/contributions", getUserContributions);

userRouter.post("/register", registerUser);

export default userRouter;
