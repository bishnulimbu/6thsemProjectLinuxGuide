import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Post from "../pages/Post";
import PostDetail from "../pages/PostDetail";
import Guide from "../pages/Guide";
import GuideDetail from "../pages/GuideDetail";
import CreatePost from "../pages/CreatePost";
import CreateGuide from "../pages/CreateGuide";
import EditPost from "../pages/EditPost";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Admin from "../pages/Admin";
import EditUser from "../pages/EditUser";
import EditGuide from "../pages/EditGuide";
import TryLinux from "../pages/TryLinux";
import Search from "../pages/Search";
import Quiz from "../pages/Quiz";
import ForYou from "../pages/ForYou";

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
      <Route path="create-guide" element={<CreateGuide />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/edit-post/:id" element={<EditPost />} />
      <Route path="/edit-guide/:id" element={<EditGuide />} />
      <Route path="/admin/edit-user/:id" element={<EditUser />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/try-linux" element={<TryLinux />} />
      <Route path="/search" element={<Search />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/for-you" element={<ForYou />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
);

export default AppRoutes;
