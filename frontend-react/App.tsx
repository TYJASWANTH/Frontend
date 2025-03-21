import React, { useState } from "react";

// Vulnerability: Storing sensitive information in LocalStorage
const getToken = () => localStorage.getItem("authToken");

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

  // Vulnerability: Using HTTP instead of HTTPS
  const API_URL = "http://your-api.com/api/login"; 

  const handleLogin = async () => {
    // Vulnerability: No Input Validation (XSS Possible)
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (data.token) {
      // Vulnerability: Storing JWT in LocalStorage (XSS Risk)
      localStorage.setItem("authToken", data.token);
      setMessage("Login successful!");
    } else {
      setMessage("Invalid credentials");
    }
  };

  return (
    <div>
      <h1>Vulnerable React App</h1>

      {/* Vulnerability: No escaping of user input (XSS possible) */}
      <h2>Welcome, {username}</h2>

      <div>
        <label>Username:</label>
        <input type="text" onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div>
        <label>Password:</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
      </div>

      <button onClick={handleLogin}>Login</button>

      {/* Vulnerability: Displaying user input directly without sanitization (XSS) */}
      <div dangerouslySetInnerHTML={{ __html: `<p>${message}</p>` }} />

      {/* Vulnerability: No validation, attacker can inject JavaScript into the search bar */}
      <div>
        <label>Search:</label>
        <input type="text" onChange={(e) => setSearchQuery(e.target.value)} />
        <p>Results for: {searchQuery}</p>  {/* XSS Attack Vector */}
      </div>
    </div>
  );
};

// vulnerable.js

// 1. DOM-based XSS Vulnerability
document.getElementById("submitBtn").addEventListener("click", function () {
    const userInput = document.getElementById("userInput").value;
    document.getElementById("output").innerHTML = "<p>" + userInput + "</p>"; // XSS Risk
});

// 2. Insecure eval() usage - can lead to RCE
document.getElementById("executeBtn").addEventListener("click", function () {
    const codeInput = document.getElementById("codeInput").value;
    eval(codeInput); // Dangerous: Arbitrary JavaScript Execution
});

// 3. Hardcoded API Key (Information Exposure)
const apiKey = "1234567890-abcdefg"; // This should never be hardcoded in front-end code

// 4. Open Redirect
document.getElementById("redirectBtn").addEventListener("click", function () {
    const url = new URLSearchParams(window.location.search).get("redirect");
    if (url) {
        window.location.href = url; // Dangerous: Allows attackers to redirect users to phishing sites
    }
});


export default App;
