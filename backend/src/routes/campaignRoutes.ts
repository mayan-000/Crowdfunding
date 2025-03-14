import express from "express";
import dotenv from "dotenv";
import {
  contributeToCampaign,
  createCampaign,
  getAllCampaign,
  getCamapignContributions,
  getCampaign,
} from "../controllers/campaignController";

dotenv.config();

const campaignRouter = express.Router();

campaignRouter.post("/create", createCampaign);
campaignRouter.get("/all", getAllCampaign);
campaignRouter.get("/:campaignId", getCampaign);
campaignRouter.post("/contribute", contributeToCampaign);
campaignRouter.get("/:campaignId/contributions", getCamapignContributions);

export default campaignRouter;
