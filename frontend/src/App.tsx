import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import CampaignPage from "./pages/CampaignPage";
import CreateCampaign from "./pages/CampaignPage/CreateCampaign";

const App = () => {
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
