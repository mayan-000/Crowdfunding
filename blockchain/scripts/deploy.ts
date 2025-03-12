import { ethers, upgrades } from "hardhat";

async function main() {
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  console.log("Deploying Crowdfunding Proxy...");
  const crowdfunding = await upgrades.deployProxy(Crowdfunding, [], {
    initializer: "initialize",
  });

  await crowdfunding.waitForDeployment();
  console.log("Crowdfunding Proxy deployed at:", await crowdfunding.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
