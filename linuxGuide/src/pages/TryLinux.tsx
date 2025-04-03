import React from "react";
import UserTerminal from "../components/ui/UserTerminal";

const TryLinux: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Try Linux Commands
        </h1>
        <p className="text-gray-600 mb-4">
          Use the terminal below to practice Linux commands in a safe sandboxed
          environment. You can try commands like{" "}
          <code aria-label="Linux command ls">ls</code>,{" "}
          <code aria-label="Linux command pwd">pwd</code>,{" "}
          <code aria-label="Linux command echo">echo</code>,{" "}
          <code aria-label="Linux command nano">nano</code>,{" "}
          <code aria-label="Linux command vim">vim</code>,{" "}
          <code aria-label="Linux command grep">grep</code>, and{" "}
          <code aria-label="Linux command python3">python3</code>. Package
          installation commands (e.g.,{" "}
          <code aria-label="Linux command apt install">apt install</code>) are
          simulated for learning purposes.
        </p>

        <UserTerminal />
        {/* Add the new Info section here */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Info: What You Can Do in the Terminal
          </h2>
          <p className="text-gray-600 mb-2">
            This terminal provides a safe sandboxed Linux environment where you
            can practice various commands and activities:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>
              <strong>Run Basic Linux Commands:</strong> Use commands like{" "}
              <code aria-label="Linux command ls">ls</code>,{" "}
              <code aria-label="Linux command pwd">pwd</code>,{" "}
              <code aria-label="Linux command echo">echo</code>,{" "}
              <code aria-label="Linux command cat">cat</code>,{" "}
              <code aria-label="Linux command mkdir">mkdir</code>,{" "}
              <code aria-label="Linux command rm">rm</code>,{" "}
              <code aria-label="Linux command cp">cp</code>,{" "}
              <code aria-label="Linux command mv">mv</code>,{" "}
              <code aria-label="Linux command grep">grep</code>, and more to
              manage files, directories, and process text.
            </li>
            <li>
              <strong>Edit Files:</strong> Use text editors like{" "}
              <code aria-label="Linux command nano">nano</code> or{" "}
              <code aria-label="Linux command vim">vim</code> to create and edit
              files (if installed).
            </li>
            <li>
              <strong>Run Python Scripts:</strong> If{" "}
              <code aria-label="Linux command python3">python3</code> is
              installed, you can run Python commands or scripts (e.g.,{" "}
              <code aria-label="Linux command python3">python3 script.py</code>
              ).
            </li>
            <li>
              <strong>Simulate Package Installation:</strong> Try commands like{" "}
              <code aria-label="Linux command apt install">
                apt install curl
              </code>{" "}
              to simulate package installation for learning purposes (actual
              installation is disabled).
            </li>
            <li>
              <strong>Use Command History:</strong> Press the Up and Down arrow
              keys to navigate through your command history.
            </li>
            <li>
              <strong>Interact with a Sandboxed Environment:</strong> Experiment
              in a safe environment with resource limits (128MB RAM, limited CPU
              usage). Your session runs in a Docker container that auto-deletes
              when you’re done.
            </li>
            <li>
              <strong>Experience Session Timeout:</strong> If you’re inactive
              for 5 minutes, the session will close with a message: "Session
              timed out due to inactivity."
            </li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Limitations
          </h3>
          <p className="text-gray-600 mb-2">
            To ensure safety and performance, there are some restrictions:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>
              <strong>No Real Package Installation:</strong> Commands like{" "}
              <code aria-label="Linux command apt install">apt install</code>{" "}
              are simulated and don’t install real packages.
            </li>
            <li>
              <strong>No Host System Access:</strong> You cannot access the host
              system’s files, processes, or network.
            </li>
            <li>
              <strong>Resource Limits:</strong> Commands requiring more than
              128MB of RAM or significant CPU resources may fail or be
              throttled.
            </li>
            <li>
              <strong>No Data Persistence:</strong> Files and changes are lost
              when the session ends (e.g., after a timeout or when you close the
              terminal).
            </li>
            <li>
              <strong>Limited Internet Access:</strong> Commands requiring
              internet access (e.g.,{" "}
              <code aria-label="Linux command curl">curl</code>,{" "}
              <code aria-label="Linux command wget">wget</code>) may not work
              unless configured.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TryLinux;
