import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const providerUrl = process.env.RPC_URL;
const provider = new ethers.JsonRpcProvider(providerUrl);

export default provider;
