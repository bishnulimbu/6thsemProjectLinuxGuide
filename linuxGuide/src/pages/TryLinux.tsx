import React from "react";
import UserTerminal from "../components/ui/UserTerminal";

const TryLinux: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Try Linux Commands
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Practice Linux commands in a safe sandboxed environment
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
          <p className="text-gray-700 mb-4 leading-relaxed">
            Use the terminal below to practice Linux commands in a safe
            sandboxed environment. You can try commands like{" "}
            <span className="inline-code">ls</span>,{" "}
            <span className="inline-code">pwd</span>,{" "}
            <span className="inline-code">echo</span>,{" "}
            <span className="inline-code">nano</span>,{" "}
            <span className="inline-code">vim</span>,{" "}
            <span className="inline-code">grep</span>, and{" "}
            <span className="inline-code">python3</span>. Package installation
            commands (e.g., <span className="inline-code">apt install</span>)
            are simulated for learning purposes.
          </p>
        </div>

        {/* Terminal Component */}
        <div className="mb-10">
          <UserTerminal />
        </div>

        {/* Info Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Terminal Features and Limitations
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Features Column */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                What You Can Do
              </h3>
              <ul className="space-y-3">
                {[
                  "Run Basic Linux Commands: Use commands like ls, pwd, echo, cat, mkdir, rm, cp, mv, grep to manage files and text",
                  "Edit Files: Use text editors like nano or vim to create and edit files",
                  "Run Python Scripts: Execute Python commands or scripts if python3 is available",
                  "Simulate Package Installation: Try apt install commands (simulated only)",
                  "Use Command History: Navigate history with Up/Down arrow keys",
                  "Sandboxed Environment: Experiment safely with resource limits (128MB RAM)",
                  "Session Timeout: Inactive sessions auto-close after 5 minutes",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations Column */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Limitations
              </h3>
              <ul className="space-y-3">
                {[
                  "No Real Package Installation: apt install commands are simulated",
                  "No Host System Access: Cannot access host files or processes",
                  "Resource Limits: 128MB RAM limit, CPU throttling",
                  "No Data Persistence: Changes lost after session ends",
                  "Limited Internet Access: Network commands may not work",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        .inline-code {
          font-family: "Fira Code", monospace;
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.9em;
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default TryLinux;
