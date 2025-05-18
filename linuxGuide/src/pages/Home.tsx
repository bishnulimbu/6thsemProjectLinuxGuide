import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getPosts, getGuides } from "../services/api"; // Updated import path
import { Post, Guide } from "../interfaces/interface";
import { FaBook, FaPen, FaComments, FaUserShield } from "react-icons/fa"; // Icons for features

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [postsData, guidesData] = await Promise.all([
          getPosts(),
          getGuides(),
        ]);
        setPosts(postsData);
        setGuides(guidesData);
      } catch (err: any) {
        setError("Failed to fetch data. Please try again later.");
        toast.error("Failed to fetch data", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      {/* Hero Section */}
      <section
        id="home"
        className="text-center py-16 bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl shadow-lg mb-16 text-white"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Linux Guide App
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Discover and share Linux guides and posts with a vibrant community
            of enthusiasts, from beginners to experts.
          </p>
          <Link
            to="/guides"
            className="inline-flex items-center justify-center gap-3 mt-2 px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white rounded-xl transition-all duration-300 text-white font-semibold text-lg group backdrop-blur-sm"
            aria-label="Explore Linux guides"
          >
            Explore Linux Guides
          </Link>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
              Get Engaged
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You Can Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform gives you the guides and posts to learn, explore,
              troubleshoot and engage with Linux-minded people.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-50 p-8 bg-black/10 rounded-xl hover:shadow-md transition-shadow hover:bg-black/20">
              <div className="flex items-start gap-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaBook className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Browse Guides & Posts
                  </h3>
                  <p className="text-gray-600">
                    Explore a wide range of guides and posts created by the
                    community, covering topics from beginner to advanced levels.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 bg-black/10 rounded-xl hover:shadow-md transition-shadow hover:bg-black/20">
              <div className="flex items-start gap-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaPen className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Create & Share Content
                  </h3>
                  <p className="text-gray-600">
                    Share your knowledge by creating your own guides and posts
                    to help others in the Linux community.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 bg-black/10 rounded-xl hover:shadow-md transition-shadow hover:bg-black/20">
              <div className="flex items-start gap-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaComments className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Engage with the Community
                  </h3>
                  <p className="text-gray-600">
                    Comment on guides and posts, ask questions, and connect with
                    other Linux enthusiasts.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 bg-black/10 rounded-xl hover:shadow-md transition-shadow hover:bg-black/20">
              <div className="flex items-start gap-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUserShield className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Admin Management
                  </h3>
                  <p className="text-gray-600">
                    Role-based access allows admins to manage content, ensuring
                    quality and relevance for all users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guides Section */}
        <section aria-labelledby="guides-heading" className="mb-20">
          <div className="text-center mb-12">
            <h2
              id="guides-heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Explore Guides
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover trending, latest, and most visited guides.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-lg text-gray-500">Loading guides...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-lg text-red-600 font-medium">{error}</p>
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-500">No guides available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-8 py-10">
              {guides
                .filter((guide) => guide.status === "published")
                .slice(0, 5)
                .map((guide) => (
                  <Link
                    to={`/guides/${guide.id}`}
                    key={guide.id}
                    className="group relative block p-6 bg-white rounded-xl bg-black/10 shadow-xs hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 border-r-4 border-r-blue-400 overflow-hidden hover:-translate-y-1 hover:bg-black/20"
                  >
                    {/* Status indicator bar */}
                    {/* <div */}
                    {/*   className={`absolute top-0 left-0 w-1 h-full ${ */}
                    {/*     guide.status === "published" */}
                    {/*       ? "bg-blue-500" */}
                    {/*       : "bg-yellow-500" */}
                    {/*   }`} */}
                    {/* ></div> */}

                    <div className="pl-5">
                      {" "}
                      {/* Add padding to account for status bar */}
                      {/* Title with gradient text on hover */}
                      <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300">
                        {guide.title}
                      </h3>
                      {/* Description with better line spacing */}
                      <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                        {guide.description.replace(/\\[^ ]+\{|\}/g, "")}
                      </p>
                      {/* Footer with improved spacing */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">
                            {new Date(guide.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>

                        {/* Status badge with subtle animation */}
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-200 ${
                            guide.status === "published"
                              ? "bg-green-50 text-green-700 group-hover:bg-green-100"
                              : "bg-yellow-50 text-yellow-700 group-hover:bg-yellow-100"
                          }`}
                        >
                          {guide.status.charAt(0).toUpperCase() +
                            guide.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/guides"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              View All Guides
              <svg
                className="ml-3 -mr-1 w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </section>

        {/* Posts Section */}
        <section aria-labelledby="posts-heading" className="mb-12">
          <div className="text-center mb-12">
            <h2
              id="posts-heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Latest Posts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discussions about distros, installation processes, terminal
              customizations, and more.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-lg text-gray-500">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-lg text-red-600 font-medium">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-500">No posts available yet.</p>
            </div>
          ) : (
            <div className="space-y-6 ">
              {posts.slice(0, 5).map((post) => (
                <Link
                  to={`/posts/${post.id}`}
                  key={post.id}
                  className="block p-6 bg-blue-200 bg-white rounded-lg border-l-8 border-blue-500 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Statement-style title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600">
                    {post.title}
                  </h3>

                  {/* Content */}
                  <div className="mb-4">
                    <p>{post.content.replace(/#+\s/g, "")}</p>
                  </div>

                  {/* Author and date */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-sm font-medium text-gray-700">
                      Author:{post.User.username || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/posts"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              View All Posts
              <svg
                className="ml-3 -mr-1 w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
