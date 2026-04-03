import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const Chatbot = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const sessionIdRef = useRef(uuidv4());

  const responses = {
    greeting: ["Hello 👋", "Hi there 😄", "Hey! Kaise ho?"],
    bye: ["Goodbye 👋", "See you soon!", "Take care 😄"],
    thanks: ["You're welcome 😊", "No problem 👍", "Anytime!"],
  };

  const defaultReplies = [
    "📚 How can I help you with your learning today?",
    "Tell me your doubt — I’ll guide you step by step 🧠",
    "Need help with assignments or notes?",
    "Let’s learn together 🚀",
    "Ask me anything related to your course!",
  ];

  const getDummyReply = (input, history) => {
    const text = input.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }

    if (text.includes("bye")) {
      return responses.bye[Math.floor(Math.random() * responses.bye.length)];
    }

    if (text.includes("thank")) {
      return responses.thanks[Math.floor(Math.random() * responses.thanks.length)];
    }

    if (text.includes("my name is")) {
      const name = input.split("is")[1]?.trim();
      return `Nice to meet you ${name} 😄`;
    }

    if (text.includes("what is my name")) {
      const userMsg = history.find((msg) =>
        msg.text.toLowerCase().includes("my name is")
      );
      if (userMsg) {
        const name = userMsg.text.split("is")[1]?.trim();
        return `Your name is ${name} 😉`;
      }
      return "I don't know your name yet 😅";
    }

    if (text.includes("react")) {
      return "React is a JavaScript library for building UI ⚛️";
    }

    if (text.includes("node")) {
      return "Node.js allows JavaScript to run on server 🚀";
    }
   if (text.includes("helpline")) {
  return "📞 You can contact our support team at 9720271675 or email Teamsupport@ilms.com";
}

    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = prompt;

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setLoading(true);
    setPrompt("");

    setTimeout(() => {
      const reply = getDummyReply(userMessage, chatHistory);

      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: reply },
      ]);

      setLoading(false);
    }, 800);
  };

  return (
    <div className="container">
      <div className="header">🤖 Magen</div>

      <div className="chat-box">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "msg user" : "msg ai"}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div className="typing">🤖 Typing...</div>}

        <div ref={chatEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Typing..." : "Send"}
        </button>
      </form>

      {/* ✅ CSS INSIDE SAME FILE */}
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f0f4f8;
        }

        .container {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 30px;
        }

        .header {
          background: linear-gradient(90deg, #1e90ff, #4facfe);
          color: white;
          padding: 12px 40px;
          font-size: 1.8rem;
          font-weight: bold;
          border-radius: 50px;
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .chat-box {
          width: 90%;
          height: 55vh;
          background: white;
          border-radius: 20px;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .msg {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 20px;
          font-size: 0.95rem;
          word-wrap: break-word;
          animation: fadeIn 0.3s ease;
        }

        .user {
          align-self: flex-end;
          background: linear-gradient(120deg, #1e90ff, #4facfe);
          color: white;
          border-top-right-radius: 5px;
        }

        .ai {
          align-self: flex-start;
          background: #f1f5f9;
          color: #333;
          border-top-left-radius: 5px;
        }

        .typing {
          font-size: 0.9rem;
          color: #555;
        }

        .input-area {
          width: 90%;
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .input-area input {
          flex: 1;
          padding: 14px 20px;
          border-radius: 25px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 1rem;
        }

        .input-area input:focus {
          border-color: #1e90ff;
          box-shadow: 0 0 5px rgba(30,144,255,0.5);
        }

        .input-area button {
          padding: 14px 25px;
          border: none;
          border-radius: 25px;
          background: linear-gradient(90deg, #1e90ff, #4facfe);
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s;
        }

        .input-area button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(30,144,255,0.3);
        }

        .input-area button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;