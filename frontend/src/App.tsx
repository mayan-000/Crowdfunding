import { getAllUser, getUser, getUserContributions, registerUser } from "./api";
import {
  contributeToCampaign,
  createCampaign,
  getAllCampaign,
  getCampaign,
  getCampaignContributions,
  inActivateCampaign,
  refundContributions,
  withdrawContributions,
} from "./api/campaign";

function App() {
  const registerUserHandler = async () => {
    const name = "Spiderman";

    await registerUser(name);
  };

  const getUsersHandler = async () => {
    const x = await getAllUser();
    console.log(x);
  };

  const getUserHandler = async () => {
    const address = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";

    const x = await getUser(address);
    console.log(x);
  };

  const getUserContributionsHandler = async () => {
    const address = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";

    const x = await getUserContributions(address);
    console.log(x);
  };

  const createCampaignHandler = async () => {
    const title = "Campaign 1";
    const desc = "This is a campaign";
    const goal = 1000;

    const x = await createCampaign(title, desc, goal);

    console.log(x);
  };

  const getAllCampaignHandler = async () => {
    const x = await getAllCampaign();
    console.log(x);
  };

  const getCampaignHandler = async () => {
    const campaignId = BigInt(0);
    const x = await getCampaign(campaignId);

    console.log(x);
  };

  const contributeToCampaignHandler = async () => {
    const ether = "1";
		const campaignId = BigInt(0);

    const x = await contributeToCampaign(campaignId, ether);
    console.log(x);
  };

  const getCampaignContributionsHandler = async () => {
    const campaignId = BigInt(0);
    const x = await getCampaignContributions(campaignId);
    console.log(x);
  };

  const withdrawContributionsHandler = async () => {
    const campaignId = BigInt(0);
    const x = await withdrawContributions(campaignId);
    console.log(x);
  };

	const inactiveCampaignHandler = async () => {
		const campaignId = BigInt(0);
		const x = await inActivateCampaign(campaignId);
		console.log(x);
	}

  const refundContributionsHandler = async () => {
    const campaignId = BigInt(0);
    const x = await refundContributions(campaignId);
    console.log(x);
  };

  return (
    <>
      <div>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={registerUserHandler}
        >
          Register User
        </button>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={getUsersHandler}
        >
          Get Users
        </button>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={getUserHandler}
        >
          Get User
        </button>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={getUserContributionsHandler}
        >
          Get User contributions
        </button>
        <button
          className="
					border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={createCampaignHandler}
        >
          Create campaign
        </button>
        <button
          className="
					border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={getAllCampaignHandler}
        >
          Get all campaigns
        </button>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={getCampaignHandler}
        >
          Get Campaign
        </button>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={contributeToCampaignHandler}
        >
          Contribute to campaign
        </button>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={getCampaignContributionsHandler}
        >
          Get Campaign contributions
        </button>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={withdrawContributionsHandler}
        >
          Withdraw contributions
        </button>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={inactiveCampaignHandler}
        >
          Inactive campaign
        </button>
        <button
          className="border p-2 bg-amber-200 hover:opacity-70 active:opacity-50 cursor-pointer"
          onClick={refundContributionsHandler}
        >
          Refund contributions
        </button>
      </div>
    </>
  );
}

export default App;
