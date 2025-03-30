import * as React from "react";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import Layout from "../components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="glass rounded-3xl p-12 text-center max-w-lg">
        <h1 className="text-6xl font-bold text-purple-900 mb-4">404</h1>
        <p className="text-xl text-purple-800/80 mb-8">
          Oops! This page is out of tune.
        </p>
        <Button 
          asChild
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
