// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

struct User {
	string name;
	address wallet;
	bool isRegistered;
}

contract Users {
	address [] public userAddresses;
	mapping (address => User) public users;

	event UserRegistered(address indexed user, string name);

	fallback() external {}

	function registerUser(
		string memory name
	) public {
		require(!users[msg.sender].isRegistered, 'User already exists!');

		users[msg.sender] = User(name, msg.sender, true);
		userAddresses.push(msg.sender);
		emit UserRegistered(msg.sender, name);
	}

	function getUser(address user) public view returns (User memory) {
		return users[user];
	}

	function isRegistered(address user) public view returns (bool) {
		return users[user].isRegistered;
	}

	function getAllUser() public view returns (User [] memory) {
		User [] memory _users = new User[](userAddresses.length);

		for(uint256 i = 0; i < userAddresses.length; i++) {
			_users[i] = users[userAddresses[i]];
		}

		return _users;
	}
}
