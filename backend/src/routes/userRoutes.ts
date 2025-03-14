import dotenv from "dotenv";
import express from "express";

import {
  getAllUser,
  getUser,
  registerUser,
} from "../controllers/userController";

dotenv.config();

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/:address", getUser);
userRouter.get("/all", getAllUser);
userRouter.get('/:address/contributions')

export default userRouter;
