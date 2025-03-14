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
    const filter = contract.filters.CampaignCreated();
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

export const contributeToCampaign = async (req: Request, res: Response) => {
  try {
    const { signedTx } = req.body;

    if (!signedTx) {
      res.status(400).json({ error: "Missing signed transaction" });
      return;
    }

    const txRes = await provider.broadcastTransaction(signedTx);

    res.json({
      message: "Contributed to the campaign!",
      hash: txRes.hash,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getCamapignContributions = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const filter = contract.filters.Funded(campaignId);
    const events = await contract.queryFilter(filter, 0, "latest");

    const contributions = events.map((event) => {
      const _event = event as EventLog;

      return {
        campaignId: _event.args.campaignId,
        funder: _event.args.funder,
        amount: _event.args.amount,
      };
    });

    res.json({
      contributions,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const withdrawContributions = async (req: Request, res: Response) => {
  try {
    const { signedTx } = req.body;

    if (!signedTx) {
      res.status(400).json({
        message: "Missing signed transaction!",
      });
      return;
    }

    const txRes = await provider.broadcastTransaction(signedTx);

    res.json({
      message: "Campaign money withdrawn!",
      hash: txRes.hash,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const refundContributions = async (req: Request, res: Response) => {
  try {
    const { signedTx } = req.body;

    if (!signedTx) {
      res.status(400).json({
        message: "Missing signed transaction!",
      });
      return;
    }

    const txRes = await provider.broadcastTransaction(signedTx);

    res.json({
      message: "Campaign money refunded!",
      hash: txRes.hash,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getCampaignStats = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await contract.getCampaignDetails(campaignId);
    const contributions = await contract.getCampaignContributions(campaignId);

    const stats = {
      totalRaised: campaign.amountRaised.toString(),
      goal: campaign.goal.toString(),
      contributorCount: contributions.length,
    };

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
