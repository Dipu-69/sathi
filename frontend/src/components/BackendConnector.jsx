// src/components/BackendConnector.jsx
import React, { useEffect, useState } from "react";

export default function BackendConnector() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/test") // apne backend ka URL
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error("Error:", err);
        setMessage(`Connection error: ${err.message}`);
      });
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="font-bold text-lg">Backend Response:</h2>
      <p>{message}</p>
    </div>
  );
}
