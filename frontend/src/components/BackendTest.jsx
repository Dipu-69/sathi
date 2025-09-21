import React, { useEffect, useState } from "react";

export default function BackendTest() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error("Error fetching backend:", err);
        setMessage(`Failed to connect to backend: ${err.message}`);
      });
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h3>Backend Response:</h3>
      <p>{message || "Loading..."}</p>
    </div>
  );
}
