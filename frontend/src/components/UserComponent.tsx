import { useEffect, useState } from "react";
import { User } from "../pages/UserPage";
import { getUserContributions } from "../api";
import { ethers } from "ethers";

type Contribution = {
  campaignId: string;
  funder: string;
  amount: string;
};

interface UserComponentProps {
  user: User;
}

const UserComponent = ({ user }: UserComponentProps) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);

  useEffect(() => {
    (async () => {
      const _contributions = await getUserContributions(user.address);
      setContributions(_contributions.contributions);
    })();
  }, [user.address]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Information</h2>
      <div className="mb-4">
        <span className="font-bold">Name:</span> {user.name}
        <br />
        <span className="font-bold">Address:</span> {user.address}
        <br />
        <span className="font-bold">Registered:</span>{" "}
        {user.isRegistered ? "Yes" : "No"}
      </div>

      <h2 className="text-2xl font-bold mb-4">User Contributions</h2>
      {contributions && contributions.length > 0 ? (
        <ul className="space-y-2">
          {contributions.map((contribution, index) => (
            <li key={index} className="p-2 border rounded">
              Campaign ID: {contribution.campaignId}, Amount:{" "}
              {ethers.formatEther(contribution.amount).toString()} ETH
            </li>
          ))}
        </ul>
      ) : (
        <p>No contributions found</p>
      )}
    </div>
  );
};

export default UserComponent;
