import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Post from "../pages/Post";
import PostDetail from "../pages/PostDetail";
import Guide from "../pages/Guide";
import GuideDetail from "../pages/GuideDetail";
import CreatePost from "../pages/CreatePost";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Admin from "../pages/Admin";

const AppRoutes: React.FC = () => (
  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/posts" element={<Post />} />
      <Route path="/guides" element={<Guide />} />
      <Route path="/guides/:id" element={<GuideDetail />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
);

export default AppRoutes;
