import express from "express";
import dotenv from "dotenv";
import {
  createCampaign,
  getAllCampaign,
  getCampaign,
} from "../controllers/campaignController";

dotenv.config();

const campaignRouter = express.Router();

campaignRouter.post("/create", createCampaign);
campaignRouter.get("/all", getAllCampaign);
campaignRouter.get("/:campaignId", getCampaign);

export default campaignRouter;
