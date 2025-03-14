import { Request, Response } from "express";
import { EventLog } from "ethers";

import { contract, provider } from "../blockchain";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { signedTx } = req.body;

    if (!signedTx) {
      res.status(400).json({ error: "Missing signed transaction" });
      return;
    }

    const txRes = await provider.broadcastTransaction(signedTx);

    //@todo - Add wait() for tx confirmation to update user after sometime
    res.json({
      message: "User Registered!",
      hash: txRes.hash,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    const user = await contract.getUserData(address);
    const filter = contract.filters.Funded(null, address);
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
      user,
      contributions,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await contract.getAllUser();

    res.json({
      users,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserContributions = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    const filter = contract.filters.Funder(null, address);
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
    res.status(500).json({ error: error.message });
  }
};
