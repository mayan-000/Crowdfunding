import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDataStore } from "../store/useDataStore";
import { formatEther } from "ethers";

const HomePage = () => {
  const campaigns = useDataStore((state) => state.campaigns);

  return (
    <div className="px-8 py-12">
      <div className="bg-blue-50 text-gray-800 py-32 px-8 rounded-lg text-center mb-12 shadow-lg">
        <h1 className="text-6xl font-extrabold mb-6 text-blue-600">
          Empower Ideas, Fund Dreams
        </h1>
        <p className="text-xl mb-8">
          Join our crowdfunding platform to support innovative projects or
          launch your own campaign. Together, we can bring ideas to life and
          make a difference.
        </p>
        <Link
          to="/campaign"
          className="bg-blue-600 text-white px-12 py-4 rounded-lg font-semibold shadow-md hover:bg-blue-700"
        >
          Explore Campaigns
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="text-4xl font-bold text-gray-800 text-center">
          Featured Campaigns
        </h2>
        {campaigns.length < 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {campaigns.slice(0, 6).map((campaign, index) => (
              <motion.div
                key={campaign.id}
                className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {campaign.description}
                </p>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    <strong>Goal:</strong> {formatEther(campaign.goal)} ETH
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Raised:</strong> {formatEther(campaign.raised)} ETH
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <motion.div
                      className="bg-blue-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (Number(campaign.raised) / Number(campaign.goal)) *
                            100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 1 }}
                    ></motion.div>
                  </div>
                </div>
                <Link
                  to={`/campaign/${campaign.id}`}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Learn More
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-600 text-lg mb-16">
              No campaigns available at the moment.
            </p>
            <Link
              to="/campaign/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
            >
              Start a Campaign
            </Link>
          </div>
        )}
      </section>

      <section className="mb-12 bg-gray-50 p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              step: "Step 1",
              description: "Create an account and explore campaigns.",
            },
            {
              step: "Step 2",
              description: "Support a campaign or start your own.",
            },
            {
              step: "Step 3",
              description: "Share and track your progress.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">
                {item.step}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white text-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-8 text-center">
          What Our Users Say
        </h2>
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
          <p className="text-lg italic mb-4">
            "This platform helped me bring my dream project to life. Highly
            recommend!"
          </p>
          <p className="text-right font-semibold">- Jane Doe</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
