import React from "react";

const About: React.FC = () => {
  return (
    <div className="about">
      <h1>About Linux Guide App</h1>
      <p>
        The Linux Guide App is a platform for sharing and discovering Linux
        guides and posts. Whether you're a beginner or an advanced user, our
        community provides valuable resources to help you navigate the world of
        Linux.
      </p>
      <p>Features include:</p>
      <ul>
        <li>Browsing and reading guides and posts</li>
        <li>Creating and sharing your own posts</li>
        <li>Commenting and engaging with the community</li>
        <li>Role-based access for admins to manage content</li>
      </ul>
      <p>Join our community today and start exploring!</p>
    </div>
  );
};

export default About;
