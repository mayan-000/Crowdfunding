import { useCallback, useState, useEffect } from "react";
import ShowingSupport from "../../assets/showing-support.svg";
import { useDataStore } from "../../store/useDataStore";
import { getUserCampaigns, getUserContributions } from "../../api";
import { formatEther, toNumber } from "ethers";

const UserPage = () => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [campaignsCreated, setCampaignsCreated] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const user = useDataStore((state) => state.user);
  const register = useDataStore((state) => state.register);
  const logout = useDataStore((state) => state.logout);
  const login = useDataStore((state) => state.login);

  const handleRegister = useCallback(async () => {
    setLoading(true);
    try {
      await register(name);
    } catch (error) {
      await login();
    } finally {
      setLoading(false);
    }
  }, [login, name, register]);

  useEffect(() => {
    (async () => {
      if (user?.isRegistered) {
        setLoading(false);

        const contributions = await getUserContributions(user.address);

        const campaigns = await getUserCampaigns(user.address!);

        setContributions(
          contributions.map((contributor: any) => ({
            address: contributor.contributor,
            amount: formatEther(contributor.amount),
            campaignId: contributor.campaignId,
            timestamp: contributor.timestamp,
          }))
        );

        setCampaignsCreated(
          campaigns.map((campaign: any) => ({
            id: campaign.id,
            title: campaign.title,
            goal: formatEther(campaign.goal),
            raised: formatEther(campaign.raised || "0"),
            deadline: campaign.deadline,
          }))
        );
      }
    })();
  }, [user]);

  return (
    <div className="px-8 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        Manage Your Profile
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Updating your profile...</p>
        </div>
      ) : user?.isRegistered ? (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome, {user.name}!
              </h2>
              <p className="text-gray-600">
                Here are your profile details. You can manage your account and
                view your activity.
              </p>
            </div>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all"
              onClick={logout}
            >
              Logout
            </button>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-600">
            Campaigns Created
          </h2>
          {campaignsCreated.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
              {campaignsCreated.map((campaign: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Goal: {campaign.goal} ETH
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Raised: {campaign.raised} ETH
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Deadline:{" "}
                    {new Date(
                      toNumber(campaign.deadline) * 1000
                    ).toLocaleDateString()}
                  </p>
                  <a
                    href={`/campaign/${campaign.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Campaign
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No campaigns created.</p>
          )}

          <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-600">
            Contributions
          </h2>
          {contributions.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {contributions.map((contribution: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {contribution.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Amount: {contribution.amount} ETH
                    </p>
                    <p className="text-xs text-gray-500">
                      Date:{" "}
                      {new Date(
                        toNumber(contribution.timestamp || "0") * 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={`/campaign/${contribution.campaignId}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Campaign
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No contributions found.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Register Your Account
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Enter your name below to register and start your crowdfunding
              journey.
            </p>
            <input
              type="text"
              placeholder="Enter your name"
              className="border border-gray-300 p-3 rounded-lg w-full max-w-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={handleRegister}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all"
            >
              Register Now
            </button>
            <p className="mt-4 text-gray-600">
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={login}
              >
                Login here
              </button>
            </p>
          </div>

          <div className="hidden md:block md:w-1/2 mt-10">
            <img src={ShowingSupport} alt="Showing Support" />
            <p className="text-gray-600 text-center mt-4">
              Join our platform to support innovative ideas and bring dreams to
              life. Registration is quick and easy!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
