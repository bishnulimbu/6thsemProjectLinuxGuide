import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getPosts } from "../services/api";
import { Post } from "../interfaces/interface";
import { useAuth } from "../context/AuthContext";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); // Check if the user is authenticated

  // Fetch all posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const postsData = await getPosts();
        setPosts(postsData);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || err.message || "Failed to fetch posts.";
        setError(errorMessage);
        toast.error(errorMessage, {
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

    fetchPosts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 id="posts-heading" className="text-3xl font-bold text-gray-800">
          All Posts
        </h1>
        {token && (
          <Link
            to="/create-post"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Post
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600" role="alert">
          {error}
        </p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts available.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition"
            >
              <Link
                to={`/posts/${post.id}`}
                className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition"
              >
                {post.title}
              </Link>
              <div className="flex flex-wrap items-center text-gray-600 mt-2">
                <p>
                  By{" "}
                  <span className="font-semibold">
                    {post.User?.username || "Unknown"}
                  </span>
                </p>
                <span className="mx-2">•</span>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              {post.Tags && post.Tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.Tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Posts;
