import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getPosts, getGuides } from "../services/api"; // Updated import path
import { Post, Guide } from "../interfaces/interface";

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
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md space-y-10">
      {/* Hero Section */}
      <section
        id="home"
        className="text-center py-10 bg-gray-100 rounded-lg"
        aria-labelledby="hero-heading"
      >
        <h1 id="hero-heading" className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Linux Guide App
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover and share Linux guides and posts with a vibrant community of
          enthusiasts, from beginners to experts.
        </p>
        <Link
          to="/guides"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Explore Linux guides"
        >
          Explore Guides
        </Link>
      </section>

      {/* Featured Guides Section */}
      <section aria-labelledby="guides-heading">
        <h2
          id="guides-heading"
          className="text-2xl font-semibold text-gray-800 mb-6"
        >
          Featured Guides
        </h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : guides.length === 0 ? (
          <p className="text-center text-gray-500">No guides available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides
              .filter((guide) => guide.status === "published")
              .slice(0, 3) // Limit to 3 guides
              .map((guide) => (
                <Link
                  to={`/guides/${guide.id}`}
                  key={guide.id}
                  className="block p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {guide.description.replace(/\\[^ ]+\{|\}/g, "")}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Created: {new Date(guide.createdAt).toLocaleDateString()}
                    </p>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        guide.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {guide.status.charAt(0).toUpperCase() +
                        guide.status.slice(1)}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </section>

      {/* Latest Posts Section */}
      <section aria-labelledby="posts-heading">
        <h2
          id="posts-heading"
          className="text-2xl font-semibold text-gray-800 mb-6"
        >
          Latest Posts
        </h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post) => (
              <Link
                to={`/posts/${post.id}`}
                key={post.id}
                className="block p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {post.content.replace(/#+\s/g, "")}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
