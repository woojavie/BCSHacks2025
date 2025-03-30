import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      fetch("http://localhost:5000/auth/spotify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {  
            console.log("Token exchange response:", data);
          
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              navigate("/mood-selector");
            } else {
              alert("Failed to retrieve access token");
              console.error("Access token missing in response:", data);
            }
          })          
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default CallbackPage;
