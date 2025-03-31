import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { submitContactForm } from "../services/api";

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitContactForm({ name, email, message });
      toast.success("Thank you for your message! We'll get back to you soon.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to submit the form. Please try again.");
      toast.error(err.message || "Failed to submit the form", {
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg mt-10">
        {/* Left Section - Decorative */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-500 to-blue-800 diagonal-pattern p-8 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              Get in Touch
            </h2>
            <p className="text-sm text-gray-800">
              We’re here to help! Reach out with any questions or feedback.
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[calc(100vh-5rem)]">
          <h1
            id="contact-heading"
            className="text-2xl font-semibold text-gray-800 mb-6"
          >
            Contact Us
          </h1>
          <p className="text-gray-600 mb-6">
            Have a question or feedback? We’d love to hear from you!
          </p>
          {error && (
            <p className="text-red-600 mb-4" role="alert">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-600 uppercase mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your Name"
                className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                aria-required="true"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-600 uppercase mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                aria-required="true"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="message"
                className="text-sm font-semibold text-gray-600 uppercase mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Your message here..."
                rows={5}
                className="p-3 bg-blue-50 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-800 hover:bg-blue-900"
              }`}
              aria-label="Send message"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
