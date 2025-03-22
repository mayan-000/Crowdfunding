import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CampaignPage from "./pages/CampaignPage";
import UserPage from "./pages/UserPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/user" element={<UserPage />} />
      {/* <Route path="/campaign" element={<CampaignPage />} /> */}
    </Routes>
  );
};

export default App;
