import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Post from "../pages/Post";
import Guide from "../pages/Guide";
import GuideDetail from "../pages/GuideDetail";
import CreatePost from "../pages/CreatePost";
import NotFound from "../pages/NotFound";

const AppRoutes: React.FC = () => (
  <Router>
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<Post />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/guide/:id" element={<GuideDetail />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </Router>
);

export default AppRoutes;
