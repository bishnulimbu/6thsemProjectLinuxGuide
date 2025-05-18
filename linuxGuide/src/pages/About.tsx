import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaPen, FaComments, FaUserShield } from "react-icons/fa"; // Icons for features

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg">
      {/* Header Section */}
      <header className="mb-12 text-center">
        <h1
          id="about-heading"
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          About Linux Guide App
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </header>

      {/* Introduction Section */}
      <section aria-labelledby="introduction-heading" className="mb-16">
        <h2
          id="introduction-heading"
          className="text-3xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200"
        >
          Welcome to Linux Guide App
        </h2>
        <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
          <p>
            The Linux Guide App is your go-to platform for sharing and
            discovering Linux guides and posts. Whether you're a beginner just
            starting your Linux journey or an advanced user looking to deepen
            your knowledge, our community provides valuable resources to help
            you navigate the world of Linux with confidence.
          </p>
          <p>
            Our mission is to foster a collaborative environment where Linux
            enthusiasts can learn, share, and grow together. From detailed
            guides on command-line basics to advanced system administration
            tips, we've got you covered.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section aria-labelledby="features-heading" className="mb-16">
        <h2
          id="features-heading"
          className="text-3xl font-semibold text-gray-800 mb-8 pb-2 border-b border-gray-200"
        >
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: <FaBook className="text-blue-600 text-2xl" />,
              title: "Browse Guides & Posts",
              description:
                "Explore a wide range of guides and posts created by the community, covering topics from beginner to advanced levels.",
            },
            {
              icon: <FaPen className="text-blue-600 text-2xl" />,
              title: "Create & Share Content",
              description:
                "Share your knowledge by creating your own guides and posts to help others in the Linux community.",
            },
            {
              icon: <FaComments className="text-blue-600 text-2xl" />,
              title: "Engage with the Community",
              description:
                "Comment on guides and posts, ask questions, and connect with other Linux enthusiasts.",
            },
            {
              icon: <FaUserShield className="text-blue-600 text-2xl" />,
              title: "Admin Management",
              description:
                "Role-based access allows admins to manage content, ensuring quality and relevance for all users.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <div className="flex-shrink-0 mt-1">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        aria-labelledby="cta-heading"
        className="text-center py-12 px-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl"
      >
        <h2
          id="cta-heading"
          className="text-3xl font-semibold text-gray-800 mb-6"
        >
          Join Our Community
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
          Ready to dive into the world of Linux? Join our community today and
          start exploring, learning, and sharing with fellow Linux enthusiasts!
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          aria-label="Join the Linux Guide community"
        >
          Join Now
          <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </section>
    </div>
  );
};

export default About;
