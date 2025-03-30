import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // Import the main App component
import "./index.css"; // Include global styles if you have any

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);