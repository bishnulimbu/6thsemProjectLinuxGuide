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
    term.onKey(({ key, domEvent }) => {
      const charCode = domEvent.keyCode;
      if (charCode === 13) {
        term.write("\r\n");
        const command = commandRef.current.trim();
        if (command) {
          ws.send(command);
          setCommandHistory((prev) => [command, ...prev].slice(0, 50));
          setHistoryIndex(-1);
        }
        commandRef.current = "";
      } else if (charCode === 8) {
        if (commandRef.current.length > 0) {
          commandRef.current = commandRef.current.slice(0, -1);
          term.write("\b \b");
        }
      } else if (charCode === 38) {
        if (
          commandHistory.length > 0 &&
          historyIndex < commandHistory.length - 1
        ) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          const prevCommand = commandHistory[newIndex];
          while (commandRef.current.length > 0) {
            commandRef.current = commandRef.current.slice(0, -1);
            term.write("\b \b");
          }
          commandRef.current = prevCommand;
          term.write(prevCommand);
        }
      } else if (charCode === 40) {
        if (historyIndex >= 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          while (commandRef.current.length > 0) {
            commandRef.current = commandRef.current.slice(0, -1);
            term.write("\b \b");
          }
          if (newIndex >= 0) {
            commandRef.current = commandHistory[newIndex];
            term.write(commandRef.current);
          } else {
            commandRef.current = "";
          }
        }
      } else if (domEvent.key.length === 1) {
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
    <div className="w-full h-96">
      {!isConnected && (
        <div className="text-gray-500">Connecting to terminal...</div>
      )}
      <div
        ref={terminalRef}
        className="w-full h-full"
        aria-label="Linux terminal emulator"
      />
    </div>
  );
};

export default UserTerminal;
