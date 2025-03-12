import { ethers, upgrades } from "hardhat";


async function main() {
  const PROXY_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

  console.log("Preparing upgrade...");
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");

  // Upgrade the existing contract
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, Crowdfunding);

  console.log(
    "Crowdfunding upgraded! Proxy Address (unchanged):",
    await upgraded.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
