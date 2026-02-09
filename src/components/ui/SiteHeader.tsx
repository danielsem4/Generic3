import { Menu } from "lucide-react";
import React from "react";

interface SiteHeaderProps {
  onToggleSidebar: () => void;
}


export const SiteHeader = ({ onToggleSidebar }: SiteHeaderProps) => {
  return (
   <header className="w-full h-12 flex items-center px-4 bg-card border-b border-border">
      
      {/* Left side: hamburger + title */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-2 hover:bg-muted transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

    </header>

  );
};
