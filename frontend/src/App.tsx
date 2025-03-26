import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import CampaignPage from "./pages/CampaignPage";
import CreateCampaign from "./pages/CampaignPage/CreateCampaign";
import { useDataStore } from "./store/useDataStore";

const App = () => {
  const initialize = useDataStore((state) => state.initialize);
  const [initialized, setInitialized] = useState(false);

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

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/campaign" element={<CampaignPage />}>
        <Route path="create" element={<CreateCampaign />} />
      </Route>
    </Routes>
  );
};

export default App;
