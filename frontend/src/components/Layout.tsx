
import * as React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="Vibeify-gradient min-h-screen overflow-hidden">
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
