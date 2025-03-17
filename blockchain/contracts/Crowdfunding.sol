// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./Users.sol";

contract Crowdfunding is Initializable, UUPSUpgradeable, OwnableUpgradeable {
	Users private users;
	
	struct Contribution {
		address contributor;
		uint256 amount;
	}

	struct Campaign {
		address creator;
		string title;
		string description;
		uint256 goal;
		uint256 fundsRaised;
		bool isActive;
		Contribution[] contributions;
	}

	mapping (uint256 => Campaign) public campaigns;
	uint256 public campaignCount;

	event CampaignCreated(uint256 campaignId, address creator, string title, uint256 goal);

	event Funded(uint256 campaignId, address funder, uint256 amount);

	event Withdrawn(uint256 campaignId, address creator, uint256 amount);

	function initialize() public initializer {
		__Ownable_init(msg.sender);
		__UUPSUpgradeable_init();

		users = new Users();
	}

	function registerUser(string memory name) public {
		users.registerUser(name);
	}

	function createCampaign(string memory _title, string memory _description, uint256 _goal) public {
		require(users.isRegistered(msg.sender), "User must be registered");

		campaigns[campaignCount] = Campaign(msg.sender, _title, _description, _goal, 0, true, new Contribution[](0));
		emit CampaignCreated(campaignCount, msg.sender, _title, _goal);
		campaignCount++;
	}

	function fundCampaign(uint256 _campaignId) public payable {
		require(msg.value > 0, "Must send ETH");
		Campaign storage campaign = campaigns[_campaignId];
		require(campaign.isActive, "Campaign is not active");

		campaign.fundsRaised += msg.value;
		campaign.contributions.push(Contribution(msg.sender, msg.value));
		emit Funded(_campaignId, msg.sender, msg.value);
	}

	function withdrawFunds(uint256 _campaignId) public {
		Campaign storage campaign = campaigns[_campaignId];
		require(msg.sender == campaign.creator, "Only creator can withdraw");
		require(campaign.fundsRaised > 0, "No funds to withdraw");

		uint256 amount = campaign.fundsRaised;
		campaign.fundsRaised = 0;
		payable(campaign.creator).transfer(amount);

		emit Withdrawn(_campaignId, campaign.creator, amount);
	}
	
	function refundContributions(uint256 _campaignId) public {
		Campaign storage campaign = campaigns[_campaignId];
		require(!campaign.isActive, "Campaign must be inactive");

		campaign.fundsRaised = 0;

		for (uint256 i = 0; i < campaign.contributions.length; i++) {
			payable(campaign.contributions[i].contributor).transfer(campaign.contributions[i].amount);
		}
	}

	function getCampaign(uint256 campaignId) public view returns (Campaign memory) {
		return campaigns[campaignId];
	}

	function getUserData(address _address) public view returns (User memory) {
		return users.getUser(_address);
	}

	function getAllUser() public view returns (User [] memory) {
		return users.getAllUser();
	}

	function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
