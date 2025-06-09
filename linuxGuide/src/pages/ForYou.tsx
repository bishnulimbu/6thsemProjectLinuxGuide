import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Guide } from "../interfaces/interface";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ForYou: React.FC = () => {
  const { user } = useAuth();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get("/guides/for-you", {
          params: { userId: user.id },
        });
        setGuides(response.data);
      } catch (err) {
        setError("Failed to fetch guides for you.");
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, [user?.id]);

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex justify-center p-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">For You</h1>
          <ul className="space-y-4">
            {guides.map((guide) => (
              <li key={guide.id} className="p-4 bg-white rounded-md shadow">
                <h3 className="text-lg font-semibold">{guide.title}</h3>
                <p className="text-gray-600">{guide.description}</p>
                <Link
                  to={`/guides/${guide.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
            {guides.length === 0 && (
              <p className="text-gray-500">No guides found.</p>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ForYou;
