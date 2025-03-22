// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Crowdfunding is Initializable, UUPSUpgradeable, OwnableUpgradeable {
	
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

	struct User {
	string name;
	address wallet;
	bool isRegistered;
}

	mapping (uint256 => Campaign) public campaigns;
	uint256 public campaignCount;
	address [] public userAddresses;
	mapping (address => User) public users;

	event CampaignCreated(uint256 indexed campaignId, address indexed creator, string indexed title, string refTitle, uint256 goal);

	event Funded(uint256 indexed campaignId, address indexed funder, uint256 amount);

	event Withdrawn(uint256 campaignId, address creator, uint256 amount);

	event UserRegistered(address indexed user, string name);

	function initialize() public initializer {
		__Ownable_init(msg.sender);
		__UUPSUpgradeable_init();
	}

	function registerUser(
		string memory name
	) public {
		require(!users[msg.sender].isRegistered, 'User already exists!');
		require(bytes(name).length > 0, 'Name cannot be empty!');

		users[msg.sender] = User(name, msg.sender, true);
		userAddresses.push(msg.sender);

		emit UserRegistered(msg.sender, name);
	}

	function isUserRegistered(address _address) public view returns (bool) {
		return users[_address].isRegistered;
	}

	function getUserData(address _address) public view returns (User memory) {
		return users[_address];
	}

	function getAllUser() public view returns (User [] memory) {
		User [] memory _users = new User[](userAddresses.length);

		for(uint256 i = 0; i < userAddresses.length; i++) {
			_users[i] = users[userAddresses[i]];
		}

		return _users;
	}

	function createCampaign(string memory _title, string memory _description, uint256 _goal) public returns (uint256) {
		require(isUserRegistered(msg.sender), "User must be registered");
		require(bytes(_title).length > 0, "Title cannot be empty");
		require(bytes(_description).length > 0, "Description cannot be empty");
		require(_goal > 0, "Goal must be greater than 0");

		campaigns[campaignCount] = Campaign(msg.sender, _title, _description, _goal, 0, true, new Contribution[](0));

		emit CampaignCreated(campaignCount, msg.sender, _title, _title, _goal);

		campaignCount++;

		return campaignCount - 1;
	}

	function fundCampaign(uint256 _campaignId) public payable {
		require(msg.value > 0, "Must send ETH");
		Campaign storage campaign = campaigns[_campaignId];
		require(campaign.isActive, "Campaign is not active");
		require(msg.value + campaign.fundsRaised <= campaign.goal, "Campaign goal exceeded, please send less ETH.");
		require(isUserRegistered(msg.sender), "User must be registered");

		campaign.fundsRaised += msg.value;
		campaign.contributions.push(Contribution(msg.sender, msg.value));
		emit Funded(_campaignId, msg.sender, msg.value);

		if(campaign.fundsRaised == campaign.goal) {
			campaign.isActive = false;
		}
	}

	function withdrawFunds(uint256 _campaignId) public {
		Campaign storage campaign = campaigns[_campaignId];

		require(campaign.fundsRaised == campaign.goal, "Campaign goal must be reached");
		require(msg.sender == campaign.creator, "Only creator can withdraw");
		require(campaign.fundsRaised > 0, "No funds to withdraw");
		require(!campaign.isActive, "Campaign must be inactive");

		uint256 amount = campaign.fundsRaised;
		campaign.fundsRaised = 0;
		payable(campaign.creator).transfer(amount);

		emit Withdrawn(_campaignId, campaign.creator, amount);
	}

	function inActivateCampaign(uint256 _campaignId) public {
		Campaign storage campaign = campaigns[_campaignId];
		require(msg.sender == campaign.creator, "Only creator can inactivate");
		require(campaign.isActive, "Campaign is already inactive");

		campaign.isActive = false;
	}
	
	function refundContributions(uint256 _campaignId) public {
		Campaign storage campaign = campaigns[_campaignId];
		require(!campaign.isActive, "Campaign must be inactive");
		require(campaign.fundsRaised < campaign.goal, "Campaign goal must not be reached");

		campaign.fundsRaised = 0;

		for (uint256 i = 0; i < campaign.contributions.length; i++) {
			payable(campaign.contributions[i].contributor).transfer(campaign.contributions[i].amount);
		}
	}

	function getCampaign(uint256 campaignId) public view returns (Campaign memory) {
		require(campaignId < campaignCount, "Invalid campaign ID");

		return campaigns[campaignId];
	}

	function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
