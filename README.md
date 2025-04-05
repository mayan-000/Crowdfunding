# Crowdfunding DApp

This repository contains a decentralized crowdfunding application built on Ethereum. The application allows users to create and contribute to crowdfunding campaigns in a secure and transparent manner using smart contracts.

## Features

- **Create Campaigns**: Users can create campaigns with a funding goal and deadline.
- **Contribute to Campaigns**: Supporters can contribute Ether to active campaigns.
- **Withdraw Funds**: Campaign creators can withdraw funds if the funding goal is met.
- **Refunds**: Campaign creators can issue refunds if the campaign fails to meet its goal.
- **Progress Tracking**: Users can track the progress of campaigns in real-time.

## Technical Overview
The application is built using React.js for the frontend and Solidity for the smart contracts. The smart contracts are deployed as proxy contracts to allow for future upgrades without losing the state of the contract. The frontend interacts with the smart contracts using the ethers.js library, and users can connect their MetaMask wallets to interact with the DApp.

## Tech Stack

- **Frontend**: React.js
- **Smart Contracts**: Solidity
- **Blockchain**: Ethereum
- **Development Framework**: Hardhat
- **Wallet Integration**: MetaMask

## Installation

1. Clone the repository:
	```bash
	git clone https://github.com/mayan-000/Crowdfunding.git
	cd crowdfunding
	```

2. Install dependencies for both frontend and smart contracts:
	```bash
	npm install
	```

3. Compile the smart contracts:
	```bash
	npx hardhat compile
	```

4. Deploy the smart contracts:
	```bash
	npx hardhat run scripts/deploy.js --network <network-name>
	```

5. Start the development server for the frontend:
	```bash
	npm run dev
	```

## Usage

1. Connect your MetaMask wallet to the application.
2. Create a new crowdfunding campaign by specifying the funding goal and deadline.
3. Contribute Ether to active campaigns.
4. Monitor the progress of campaigns and withdraw funds or make refunds as applicable.

## Folder Structure

- `blockchain/contracts/`: Contains Solidity smart contracts.
- `blockchain/scripts/`: Deployment and upgrade scripts.
- `frontend/src/`: React.js frontend code.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
