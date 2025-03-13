import express, { Request, Response } from "express";
import { ethers } from "ethers";
import provider from "../blockchain/provider";

const router = express.Router();

router.get("/contributions/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const tx = new ethers.Transaction();
    tx.to = process.env.CONTRACT_ADDRESS!;
    tx.data = new ethers.Interface([
      "function contributions(address) view returns (uint256)",
    ]).encodeFunctionData("contributions", [address]);

    const contributions = await provider.call(tx);

    res.json({
      contributions: ethers.formatEther(contributions),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/relay", async (req: Request, res: Response) => {
  try {
    const { signedTx } = req.body;

    if (!signedTx) {
      res.status(400).json({ error: "Missing signedTx" });
      return;
    }

    const txRes = await provider.broadcastTransaction(signedTx);

    res.json({ message: "Transaction relayed", txHash: txRes.hash });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
