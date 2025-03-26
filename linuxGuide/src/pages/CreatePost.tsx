import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import { toast } from "react-toastify";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTages] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    "draft",
  );
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !tags) {
      toast.error("Title, content and tags all are required.");
      return;
    }
    try {
      await createPost({ title, content, tags, status });
      toast.success("Post created successfully!");
      navigate("/guides");
    } catch (err: any) {
      toast.error(err.message || "Post creation failed");
    }
  };
  if (!token) {
    return (
      <div>
        <p>Please log in to create a post.</p>
        <button onClick={() => navigate("/login")}>Log In</button>
      </div>
    );
  }
  return (
    <div className="create-post">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "draft" | "published" | "archived")
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};
export default CreatePost;
