import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeatureCard from "../components/ui/FeatureCard";
import { getPosts, getGuides } from "../services/api";

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string;
  status: "draft" | "published" | "archived";
  userId: number;
  createdAt: string;
  updatedAt: string;
  User: { username: string };
}
interface Guide {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  User: { username: string };
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const features = [
    {
      title: "Fast Development",
      description:
        "Leverage React and TypeScript for rapid development with type safety.",
      icon: "⚡",
    },
    {
      title: "Responsive Design",
      description:
        "Create beautiful, responsive layouts that work on any device.",
      icon: "📱",
    },
    {
      title: "Scalable Code",
      description:
        "Write clean, maintainable, and scalable code with best practices.",
      icon: "📈",
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, guidesData] = await Promise.all([
          getPosts(),
          getGuides(),
        ]);
        setPosts(postsData);
        setGuides(guidesData);
      } catch (err: any) {
        console.error("Failed to fetch data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-10">
      <section id="home" className="text-center py-10 gb-gray-100 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Linux Guide App
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Build amazing things with React and TypeScript
        </p>
        <Link
          to="/guides"
          className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Get Started
        </Link>
      </section>

      <section id="features">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Featured Guides
        </h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : guides.length === 0 ? (
          <p className="text-center text-gray-500">No guides available.</p>
        ) : (
          <div className="flex overflow-x=auto space-x-4 pb-4">
            {guides.map((guide) => (
              <Link
                to={`/guide/${guide.id}`}
                key={guide.id}
                className="min-w-[300px] bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {guide.title}
                </h3>
                <p className="mt-2 text-gray-600 line-clamp-3">
                  {guide.content.replace(/#+\s/g, "")}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  By {guide.User.username} on{" "}
                  {new Date(guide.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Latest Posts
        </h2>
        {loading ? (
          <div className="test-center text-gray-500">Loading...</div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available.</p>
        ) : (
          <div className="flex overflow-x-auto space-x-4 pb4">
            {posts.map((post) => (
              <Link
                to={`/post/${post.id}`}
                key={post.id}
                className="min-w-[300px] bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {post.title}
                </h3>
                <p className="mt-2 text-gray-600 line-clamp-3">
                  {post.content.replace(/#+\s/g, "")}
                </p>
                <p className="mt2 text-sm text-gray-500">
                  By {post.User.username} on{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
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
