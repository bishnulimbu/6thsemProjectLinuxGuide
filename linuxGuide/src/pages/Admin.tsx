import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  getGuides,
  getPosts,
  updateGuideStatus,
  deleteGuide,
  deletePost,
  deleteUser,
  adminSignup,
  getUsers,
} from "../services/api";
import { Guide, Post, User } from "../interfaces/interface";
import { FaEdit, FaTrash, FaEye, FaPlus, FaMinus } from "react-icons/fa";

const Admin: React.FC = () => {
  const { isAdmin, user, isLoading } = useAuth(); // Added isLoading
  const [guides, setGuides] = useState<Guide[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [adminFormLoading, setAdminFormLoading] = useState(false);
  const [adminFormError, setAdminFormError] = useState<string | null>(null);

  // Fetch guides and posts
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const [guidesData, postsData, usersData] = await Promise.all([
          getGuides(),
          getPosts(),
          getUsers(),
        ]);
        setGuides(guidesData);
        setPosts(postsData);
        setUsers(usersData);
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
  }, [isAdmin]);

  // Handle guide status toggle
  const handleToggleStatus = async (guide: Guide) => {
    const newStatus = guide.status === "published" ? "draft" : "published";
    try {
      await updateGuideStatus(guide.id, newStatus);
      setGuides(
        guides.map((g) =>
          g.id === guide.id ? { ...g, status: newStatus } : g,
        ),
      );
      toast.success(`Guide status updated to ${newStatus}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err: any) {
      toast.error("Failed to update guide status", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // Handle guide deletion
  const handleDeleteGuide = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this guide?")) return;
    try {
      await deleteGuide(id);
      setGuides(guides.filter((guide) => guide.id !== id));
      toast.success("Guide deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err: any) {
      toast.error(
        "Failed to delete guide. You can only delete your own guide.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        },
      );
    }
  };

  // Handle post deletion
  const handleDeletePost = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success("Post deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err: any) {
      toast.error("Failed to delete post.You can only delete your own posts.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };
  //Hanlde delete user
  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delet this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err: any) {
      toast.error("Failed to delete user", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // Handle admin user creation
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFormLoading(true);
    setAdminFormError(null);

    const { username, email, password } = adminForm;
    if (!username || !email || !password) {
      setAdminFormError("All fields are required.");
      setAdminFormLoading(false);
      return;
    }

    try {
      await adminSignup({ username, email, password });
      toast.success("Admin user created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setAdminForm({ username: "", email: "", password: "" });
      setShowCreateAdminForm(false);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create admin user.";
      setAdminFormError(errorMessage);
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
      setAdminFormLoading(false);
    }
  };

  // Show a loading state while auth is being restored
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  // Redirect if not an admin (handled by useEffect)
  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Create Admin User Section (Super Admin Only) */}
      {user?.role === "super_admin" && (
        <section aria-labelledby="create-admin-heading" className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2
              id="create-admin-heading"
              className="text-2xl font-semibold text-gray-800"
            >
              Create New Admin User
            </h2>
            <button
              onClick={() => setShowCreateAdminForm(!showCreateAdminForm)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition"
              aria-expanded={showCreateAdminForm}
              aria-controls="create-admin-form"
            >
              {showCreateAdminForm ? (
                <>
                  <FaMinus className="mr-2" /> Hide Form
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" /> Show Form
                </>
              )}
            </button>
          </div>
          {showCreateAdminForm && (
            <div id="create-admin-form" className="p-4 bg-gray-50 rounded-md">
              {adminFormError && (
                <p className="text-red-600 mb-4" role="alert">
                  {adminFormError}
                </p>
              )}
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="admin-username"
                    className="text-sm font-semibold text-gray-600 uppercase mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="admin-username"
                    type="text"
                    value={adminForm.username}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, username: e.target.value })
                    }
                    required
                    placeholder="Enter username"
                    className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    aria-required="true"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="admin-email"
                    className="text-sm font-semibold text-gray-600 uppercase mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={adminForm.email}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, email: e.target.value })
                    }
                    required
                    placeholder="Enter email"
                    className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    aria-required="true"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="admin-password"
                    className="text-sm font-semibold text-gray-600 uppercase mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={adminForm.password}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, password: e.target.value })
                    }
                    required
                    placeholder="Enter password"
                    className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    aria-required="true"
                  />
                </div>
                <button
                  type="submit"
                  disabled={adminFormLoading}
                  className={`w-full py-3 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
                    adminFormLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-800 hover:bg-blue-900"
                  }`}
                  aria-label="Create new admin user"
                >
                  {adminFormLoading ? "Creating..." : "Create Admin User"}
                </button>
              </form>
            </div>
          )}
        </section>
      )}
      {/* User Section */}
      <section aria-labelledby="users-heading" className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2
            id="users-heading"
            className="text-2xl font-semibold text-gray-800"
          >
            Manage Users
          </h2>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500">No Users available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-50 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Created</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">
                      {user.email || "No User Email"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.role === "super_admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className={`text-red-600 hover:text-red-800 ${
                          user.role === "super_admin"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={user.role === "super_admin"}
                        aria-label={`Delete user ${user.username}`}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Guides Section */}
      <section aria-labelledby="guides-heading" className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2
            id="guides-heading"
            className="text-2xl font-semibold text-gray-800"
          >
            Manage Guides
          </h2>
          <Link
            to="/create-guide"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Guide
          </Link>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : guides.length === 0 ? (
          <p className="text-center text-gray-500">No guides available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-50 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Author</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Created</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guides.map((guide) => (
                  <tr key={guide.id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4">{guide.title}</td>
                    <td className="py-3 px-4">
                      {guide.User?.username || "Unknown"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(guide)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          guide.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        } hover:opacity-80 transition`}
                      >
                        {guide.status.charAt(0).toUpperCase() +
                          guide.status.slice(1)}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(guide.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 flex space-x-2">
                      <Link
                        to={`/guides/${guide.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`View guide ${guide.title}`}
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/edit-guide/${guide.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Edit guide ${guide.title}`}
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDeleteGuide(guide.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Delete guide ${guide.title}`}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Posts Section */}
      <section aria-labelledby="posts-heading">
        <div className="flex justify-between items-center mb-4">
          <h2
            id="posts-heading"
            className="text-2xl font-semibold text-gray-800"
          >
            Manage Posts
          </h2>
          <Link
            to="/create-post"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Post
          </Link>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-50 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Author</th>
                  <th className="py-3 px-4 text-left">Created</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4">{post.title}</td>
                    <td className="py-3 px-4">
                      {post.User?.username || "Unknown"}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 flex space-x-2">
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`View post ${post.title}`}
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/edit-post/${post.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Edit post ${post.title}`}
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Delete post ${post.title}`}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Admin;
