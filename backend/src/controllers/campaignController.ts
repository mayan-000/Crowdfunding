import { Request, Response } from "express";
import { ethers, EventLog } from "ethers";

import { contract, provider } from "../blockchain";

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { signedTx } = req.body;

    if (!signedTx) {
      res.status(400).json({ error: "Missing signed transaction" });
      return;
    }

    const txRes = await provider.broadcastTransaction(signedTx);

    res.json({
      message: "Campaign Created!",
      hash: txRes.hash,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getAllCampaign = async (req: Request, res: Response) => {
  try {
    const filter = await contract.filters.CampaignCreated();
    const events = await contract.queryFilter(filter, 0, "lastest");

    const campaigns = events.map((event) => {
      const _event = event as EventLog;

      return {
        campaignId: _event.args.campaignId,
        creator: _event.args.creator,
        title: _event.args.title,
        goal: _event.args.goal,
      };
    });

    res.json({
      campaigns,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await contract.getCampaign(campaignId);

    res.json({
      campaign,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};
