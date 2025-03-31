import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaPen, FaComments, FaUserShield } from "react-icons/fa"; // Icons for features

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <h1
        id="about-heading"
        className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left"
      >
        About Linux Guide App
      </h1>

      {/* Introduction Section */}
      <section aria-labelledby="introduction-heading">
        <h2
          id="introduction-heading"
          className="text-2xl font-semibold text-gray-700 mb-4"
        >
          Welcome to Linux Guide App
        </h2>
        <p className="text-gray-600 mb-4">
          The Linux Guide App is your go-to platform for sharing and discovering
          Linux guides and posts. Whether you're a beginner just starting your
          Linux journey or an advanced user looking to deepen your knowledge,
          our community provides valuable resources to help you navigate the
          world of Linux with confidence.
        </p>
        <p className="text-gray-600 mb-6">
          Our mission is to foster a collaborative environment where Linux
          enthusiasts can learn, share, and grow together. From detailed guides
          on command-line basics to advanced system administration tips, we’ve
          got you covered.
        </p>
      </section>

      {/* Features Section */}
      <section aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className="text-2xl font-semibold text-gray-700 mb-4"
        >
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start space-x-3">
            <FaBook className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Browse Guides & Posts
              </h3>
              <p className="text-gray-600">
                Explore a wide range of guides and posts created by the
                community, covering topics from beginner to advanced levels.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FaPen className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Create & Share Content
              </h3>
              <p className="text-gray-600">
                Share your knowledge by creating your own guides and posts to
                help others in the Linux community.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FaComments className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Engage with the Community
              </h3>
              <p className="text-gray-600">
                Comment on guides and posts, ask questions, and connect with
                other Linux enthusiasts.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FaUserShield className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Admin Management
              </h3>
              <p className="text-gray-600">
                Role-based access allows admins to manage content, ensuring
                quality and relevance for all users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section aria-labelledby="cta-heading">
        <h2
          id="cta-heading"
          className="text-2xl font-semibold text-gray-700 mb-4"
        >
          Join Our Community
        </h2>
        <p className="text-gray-600 mb-6">
          Ready to dive into the world of Linux? Join our community today and
          start exploring, learning, and sharing with fellow Linux enthusiasts!
        </p>
        <div className="text-center">
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Join the Linux Guide community"
          >
            Join Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
