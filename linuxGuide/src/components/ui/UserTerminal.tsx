import { useEffect, useState, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const UserTerminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isConnected, setIsConnected] = useState(false);
  const commandRef = useRef<string>("");

  useEffect(() => {
    // Initialize terminal
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    if (terminalRef.current) {
      term.open(terminalRef.current);
      const fitTerminal = () => {
        try {
          if (terminalRef.current && terminalRef.current.offsetWidth > 0) {
            fitAddon.fit();
          } else {
            setTimeout(fitTerminal, 100); // Retry after 100ms
          }
        } catch (err) {
          console.error("Error fitting terminal:", err);
        }
      };
      fitTerminal();
    }

    // Initialize WebSocket
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000";
    console.log("Connecting to WebSocket at:", wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      term.write(
        "Connected to Linux sandbox. Package installation (e.g., apt install) is simulated for learning. Try commands like ls, pwd, echo, nano, vim, grep, python3:\r\n$ ",
      );
    };
    ws.onmessage = (event) => {
      term.write(event.data);
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      term.write(`Error: ${error}\r\n`);
    };
    ws.onclose = (event) => {
      console.log("WebSocket closed:", event);
      term.write("Connection closed.\r\n");
    };

    // Handle terminal input
    // Updated history navigation logic:
    term.onKey(({ key, domEvent }) => {
      const charCode = domEvent.keyCode;
      if (charCode === 13) {
        // Enter
        term.write("\r\n");
        const command = commandRef.current.trim();
        if (command) {
          ws.send(command);
          setCommandHistory((prev) => [command, ...prev].slice(0, 50));
          setHistoryIndex(-1);
        }
        commandRef.current = "";
      } else if (charCode === 8) {
        // Backspace
        if (commandRef.current.length > 0) {
          commandRef.current = commandRef.current.slice(0, -1);
          term.write("\b \b");
        }
      } else if (charCode === 38) {
        // Up arrow
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          term.write("\x1b[2K\r$ "); // Clear line and rewrite prompt
          commandRef.current = commandHistory[newIndex];
          term.write(commandRef.current);
        }
      } else if (charCode === 40) {
        // Down arrow
        if (historyIndex >= 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          term.write("\x1b[2K\r$ "); // Clear line and rewrite prompt
          if (newIndex >= 0) {
            commandRef.current = commandHistory[newIndex];
            term.write(commandRef.current);
          } else {
            commandRef.current = "";
          }
        }
      } else if (key.length === 1) {
        // Regular character
        commandRef.current += key;
        term.write(key);
      }
    });

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (err) {
        console.error("Error resizing terminal:", err);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      term.dispose();
      if (wsRef.current) wsRef.current.close();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-w-full min-h-[600px] bg-gray-900 rounded-lg overflow-hidden p-1">
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-900">
          Connecting to terminal...
        </div>
      )}
      <div
        ref={terminalRef}
        className="w-full h-full font-mono text-l text-gray-100"
        aria-label="Linux terminal emulator"
      />
    </div>
  );
};

export default UserTerminal;
