import { Guide } from "../interfaces/interface";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGuides } from "../services/api";
import { toast } from "react-toastify";

const Guides: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      setError(null);
      try {
        const guideData = await getGuides();
        const filterdGuides = isAdmin
          ? guideData
          : guideData.filter((guide: Guide) => guide.status === "published");
        setGuides(filterdGuides);
      } catch (err: any) {
        setError(err.message || "Failed to fetch guides.");
        toast.error(err.message || "Failed to fetch guides", {
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
    fetchGuides();
  }, [isAdmin]);

  return (
    <div>
      <h1>guides</h1>
      {isAdmin && (
        <button onClick={() => navigate("/create-guide")}>create guide</button>
      )}
      {loading ? (
        <h1>loading...</h1>
      ) : error ? (
        <h1>{error}</h1>
      ) : guides.length === 0 ? (
        <h1>no guides available</h1>
      ) : (
        guides.map((guide) => (
          <div key={guide.id}>
            <h1>Created: {new Date(guide.createdAt).toLocaleString()}</h1>
            <p>
              {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
            </p>
            <h3>{guide.title}</h3>
          </div>
        ))
      )}
    </div>
  );
};

export default Guides;
