import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Fixed import
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FaTimes } from "react-icons/fa";
import {
  getGuides,
  getPosts,
  updateGuideStatus,
  deleteGuide,
  deletePost,
  deleteUser,
  adminSignup,
  getUsers,
  getUserById,
} from "../services/api";
import { Guide, Post, User } from "../interfaces/interface";
import { FaEdit, FaTrash, FaEye, FaPlus, FaMinus } from "react-icons/fa";

const Admin: React.FC = () => {
  const { isAdmin, user, isLoading, isSuperAdmin } = useAuth();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);
  const navigate = useNavigate(); // Fixed usage
  const [adminForm, setAdminForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [adminFormLoading, setAdminFormLoading] = useState(false);
  const [adminFormError, setAdminFormError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch guides, posts, and users
  useEffect(() => {
    const fetchData = async () => {
      // Wait for auth loading to complete and check if user is admin
      if (isLoading) return;
      if (!isAdmin) {
        setError("You do not have permission to access this page.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [guidesData, postsData] = await Promise.all([
          getGuides(),
          getPosts(),
        ]);
        setGuides(guidesData);
        setPosts(postsData);
        if (isSuperAdmin) {
          try {
            const userData = await getUsers();
            setUsers(userData);
          } catch (userErr: any) {
            toast.error(
              "Failed to fetch users: " + (userErr.message || "Unknown error"),
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
        } else {
          setUsers([]);
        }
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to fetch data. Please try again later.";
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
    fetchData();
  }, [isAdmin, isLoading, isSuperAdmin]); // Added isLoading to dependencies

  // Handle edit user
  const handleEditUser = (userId: number) => {
    navigate(`/admin/edit-user/${userId}`); // Navigate to the edit user page
  };

  // Handle view user
  const handleViewUser = async (userId: number) => {
    try {
      const userData = await getUserById(userId); // Fetch user details using the API function
      setSelectedUser(userData); // Set the user data to display in a modal
      setIsModalOpen(true); // Open the modal to view user details
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch user details", {
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
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      {/* Dashboard Header */}
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users, guides, and posts</p>
      </div>

      {/* Create Admin User Section (Super Admin Only) */}
      {user?.role === "super_admin" && (
        <section className="mb-10 bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Create New Admin User
            </h2>
            <button
              onClick={() => setShowCreateAdminForm(!showCreateAdminForm)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              aria-expanded={showCreateAdminForm}
            >
              {showCreateAdminForm ? (
                <>
                  <FaMinus /> Hide Form
                </>
              ) : (
                <>
                  <FaPlus /> Show Form
                </>
              )}
            </button>
          </div>

          {showCreateAdminForm && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {adminFormError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                  {adminFormError}
                </div>
              )}
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={adminForm.username}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, username: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={adminForm.email}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={adminForm.password}
                      onChange={(e) =>
                        setAdminForm({ ...adminForm, password: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={adminFormLoading}
                  className={`mt-4 w-full py-2.5 rounded-md text-white font-medium ${
                    adminFormLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {adminFormLoading ? "Creating..." : "Create Admin User"}
                </button>
              </form>
            </div>
          )}
        </section>
      )}

      {/* User Management Section */}
      {isSuperAdmin && (
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Manage Users
            </h2>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
          ) : users.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded-lg">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "super_admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "admin"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "No Date Available"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewUser(user.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === "super_admin"}
                            className={`text-red-600 hover:text-red-900 ${
                              user.role === "super_admin"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Guides Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Manage Guides
          </h2>
          <Link
            to="/create-guide"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus /> Create Guide
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        ) : guides.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-600">No guides found</p>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guides.map((guide) => (
                  <tr key={guide.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {guide.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {guide.User?.username || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(guide)}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          guide.status === "published"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }`}
                      >
                        {guide.status.charAt(0).toUpperCase() +
                          guide.status.slice(1)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(guide.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/guides/${guide.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/edit-guide/${guide.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteGuide(guide.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Posts Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Posts</h2>
          <Link
            to="/create-post"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus /> Create Post
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        ) : posts.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-600">No posts found</p>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.User?.username || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/posts/${post.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/edit-post/${post.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        User Details
                      </h3>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Username</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedUser.username}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Role</p>
                          <p className="mt-1 text-sm text-gray-900 capitalize">
                            {selectedUser.role.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedUser.email || "N/A"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Created</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedUser.createdAt
                              ? new Date(
                                  selectedUser.createdAt,
                                ).toLocaleString()
                              : "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedUser.updatedAt
                              ? new Date(
                                  selectedUser.updatedAt,
                                ).toLocaleString()
                              : "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
