import express from "express";
import dotenv from "dotenv";
import {
  contributeToCampaign,
  createCampaign,
  getAllCampaign,
  getCamapignContributions,
  getCampaign,
  getCampaignStats,
  refundContributions,
  withdrawContributions,
} from "../controllers/campaignController";

dotenv.config();

const campaignRouter = express.Router();

campaignRouter.get("/all", getAllCampaign);
campaignRouter.get("/:campaignId", getCampaign);
campaignRouter.get("/stats", getCampaignStats);
campaignRouter.get("/:campaignId/contributions", getCamapignContributions);

campaignRouter.post("/contribute", contributeToCampaign);
campaignRouter.post("/withdraw", withdrawContributions);
campaignRouter.post("/refund", refundContributions);
campaignRouter.post("/create", createCampaign);

export default campaignRouter;
