import { useCallback, useEffect, useState } from "react";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import CampaignPage from "./pages/CampaignPage";
import { useDataStore } from "./store/useDataStore";
import { ToastContainer } from "react-toastify";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import UserDetailsPage from "./pages/UserPage/UserDetailsPage";
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";

const App = () => {
  const initialize = useDataStore((state) => state.initialize);
  const isLoggedIn = useDataStore((state) => state.isLoggedIn);
  const pendingTransactions = useDataStore(
    (state) => state.pendingTransactions
  );
  const login = useDataStore((state) => state.login);
  const [initialized, setInitialized] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    initialize().then((cleanup) => {
      if (isMounted && cleanup) {
        setInitialized(true);
        return cleanup;
      }
    });

    return () => {
      isMounted = false;
      setInitialized(false);
    };
  }, [initialize]);

  const handleLogin = useCallback(async () => {
    const userFound = await login();

    if (!userFound) {
      navigate("/user");
    }
  }, [login, navigate]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Crowdfunding
        </Link>
        <nav className="flex items-center space-x-6 relative">
          <div
            className="relative cursor-pointer"
            onClick={() => setShowTransactions((prev) => !prev)}
          >
            <FaSpinner
              className={`text-blue-600 ${
                pendingTransactions.some((tx) => !tx.confirmed)
                  ? "animate-spin"
                  : ""
              }`}
              title="Pending Transactions"
            />
            {pendingTransactions.some((tx) => !tx.confirmed) && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {pendingTransactions.filter((tx) => !tx.confirmed).length}
              </span>
            )}
          </div>

          {showTransactions && (
            <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                Pending Transactions
              </h3>
              {pendingTransactions.length > 0 ? (
                <ul className="space-y-2">
                  {pendingTransactions.map((tx, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm truncate"
                      >
                        {tx.hash}
                      </a>
                      {tx.confirmed ? (
                        <FaCheckCircle
                          className="text-green-500"
                          title="Confirmed"
                        />
                      ) : (
                        <FaTimesCircle
                          className="text-red-500"
                          title="Pending"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No pending transactions.
                </p>
              )}
            </div>
          )}

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </Link>
          {isLoggedIn ? (
            <Link
              className="text-gray-700 hover:text-blue-600 font-medium"
              to="/user"
            >
              Profile
            </Link>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer hover:opacity-90"
              onClick={handleLogin}
            >
              Register / Login
            </button>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/user/:userId" element={<UserDetailsPage />} />
        <Route path="/campaign" element={<CampaignPage />} />
        <Route path="/campaign/:campaignId" element={<CampaignDetailsPage />} />
      </Routes>

      <Outlet />

      <ToastContainer />

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                Crowdfunding
              </Link>
              <p className="text-gray-600 mt-2">
                Empowering ideas and funding dreams.
              </p>
            </div>

            <div className="flex space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/campaign"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Campaigns
              </Link>
              <Link
                to="/user"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Profile
              </Link>
            </div>

            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
              >
                <i className="fab fa-twitter"></i> Twitter
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
              >
                <i className="fab fa-facebook"></i> Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
              >
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm mt-8">
            © {new Date().getFullYear()} Crowdfunding. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
