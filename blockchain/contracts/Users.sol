// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Users {
	struct User {
		string name;
		address wallet;
		bool isRegistered;
	}

	mapping (address => User) public users;

	event UserRegistered(address indexed user, string name);

	fallback() external {}

	function registerUser(
		string memory name
	) public {
		require(!users[msg.sender].isRegistered, 'User already exists!');

		users[msg.sender] = User(name, msg.sender, true);
		emit UserRegistered(msg.sender, name);
	}

	function getUser(address user) public view returns (User memory) {
		return users[user];
	}

	function isRegistered(address user) public view returns (bool) {
		return users[user].isRegistered;
	}
}
