import React from "react";

const TestTailwind: React.FC = () => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
      <h1 className="text-2xl font-bold">Tailwind CSS Test</h1>
      <p className="mt-2">
        If you see a blue box with white text, Tailwind is working!
      </p>
    </div>
  );
};

export default TestTailwind;
