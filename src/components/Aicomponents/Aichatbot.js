import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const Chatbot = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  // Generate a unique session ID for this user
  const sessionIdRef = useRef(uuidv4());

  // Fetch previous conversation from MongoDB on mount
  useEffect(() => {
    fetch(`http://localhost:6500/api/chatbot/${sessionIdRef.current}`)
      .then((res) => res.json())
      .then((messages) => setChatHistory(messages))
      .catch(console.error);
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: prompt }]);
    setLoading(true);
    setPrompt("");

    try {
      const res = await fetch("http://localhost:6500/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, sessionId: sessionIdRef.current }),
      });

      if (!res.ok) throw new Error("Failed to fetch from backend");

      const data = await res.json();
      setChatHistory((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f0f4f8",
        paddingTop: "40px",
      }}
    >
      {/* Capsule Header */}
      <div
        style={{
          background: "linear-gradient(90deg, #1e90ff, #4facfe)",
          color: "#fff",
          padding: "12px 40px",
          fontSize: "1.8rem",
          fontWeight: "700",
          textAlign: "center",
          borderRadius: "50px",
          marginBottom: "30px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          width: "25%", // 1/4 width
          minWidth: "220px", // small screens
        }}
      >
        🤖 Magen
      </div>

      {/* Chat Area */}
      <div
        style={{
          width: "90%",
          height: "50vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          overflowY: "auto",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background:
                msg.sender === "user"
                  ? "linear-gradient(120deg, #1e90ff, #4facfe)"
                  : "#f1f5f9",
              color: msg.sender === "user" ? "#fff" : "#333",
              padding: "12px 16px",
              borderRadius: "20px",
              borderTopLeftRadius: msg.sender === "user" ? "20px" : "6px",
              borderTopRightRadius: msg.sender === "user" ? "6px" : "20px",
              maxWidth: "75%",
              wordBreak: "break-word",
              fontSize: "0.95rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              position: "relative",
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "12px",
          width: "90%",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: "16px 24px",
            borderRadius: "25px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "16px 30px",
            borderRadius: "25px",
            border: "none",
            background: "linear-gradient(90deg, #1e90ff, #4facfe)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0; transform: translateY(5px);}
            to {opacity: 1; transform: translateY(0);}
          }
          input:focus {
            border-color: #1e90ff;
            box-shadow: 0 0 5px rgba(30,144,255,0.5);
          }
          button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 14px rgba(30,144,255,0.3);
          }
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
};

export default Chatbot;
