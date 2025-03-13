import dotenv from "dotenv";
import { ethers } from "ethers";

import contractJSON from "../../../blockchain/artifacts/contracts/Crowdfunding.sol/Crowdfunding.json";

dotenv.config();

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  contractJSON.abi
);

export default contract;
