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

campaignRouter.post("/create", createCampaign);
campaignRouter.get("/all", getAllCampaign);
campaignRouter.get("/:campaignId", getCampaign);
campaignRouter.post("/contribute", contributeToCampaign);
campaignRouter.get("/:campaignId/contributions", getCamapignContributions);
campaignRouter.post("/withdraw", withdrawContributions);
campaignRouter.post("/refund", refundContributions);
campaignRouter.get("/stats", getCampaignStats);

export default campaignRouter;
