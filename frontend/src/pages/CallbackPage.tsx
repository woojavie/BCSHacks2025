import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { Loader, Music, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const CallbackPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting to Spotify...");

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      setStatus("error");
      setMessage("Authorization code missing");
      return;
    }

    // Show a loading state for at least 1.5 seconds for better UX
    const minLoadingTime = 1500;
    const startTime = Date.now();

    fetch("http://localhost:5000/auth/spotify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Token exchange response:", data);

        if (data.access_token) {
          localStorage.setItem("accessToken", data.access_token);
          
          // Calculate remaining time to show loading for at least minLoadingTime
          const elapsed = Date.now() - startTime;
          const remainingDelay = Math.max(0, minLoadingTime - elapsed);
          
          // Show success state briefly before redirecting
          setStatus("success");
          setMessage("Successfully connected!");
          
          setTimeout(() => {
            toast({
              title: "Successfully connected to Spotify",
              description: "Let's find your perfect music mix!",
            });
            navigate("/mood-selector");
          }, remainingDelay + 800); // Add extra time to see success state
        } else {
          setStatus("error");
          setMessage("Failed to retrieve access token");
          console.error("Access token missing in response:", data);
        }
      })
      .catch((error) => {
        console.error("Error exchanging code for token:", error);
        setStatus("error");
        setMessage("Connection error. Please try again.");
      });
  }, [navigate, toast]);

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto">
        <div className="glass rounded-3xl p-8 flex flex-col items-center text-center">
          <div className="mb-6">
            <Music className="h-16 w-16 text-white/90" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white/90 drop-shadow-lg">
            Vibeify
          </h1>
          
          <div className="relative h-24 flex flex-col items-center justify-center mb-4">
            {status === "loading" && (
              <Loader className="h-10 w-10 text-white/90 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-12 w-12 text-green-400 animate-pulse" />
            )}
            {status === "error" && (
              <AlertCircle className="h-12 w-12 text-red-400 animate-pulse" />
            )}
          </div>
          
          <p className="text-xl text-white/80 mb-4">{message}</p>
          
          {status === "error" && (
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              Return Home
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CallbackPage;
