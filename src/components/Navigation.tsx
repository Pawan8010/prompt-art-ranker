
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Shield, Home } from "lucide-react";

interface NavigationProps {
  currentView: 'home' | 'admin';
  onViewChange: (view: 'home' | 'admin') => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card/80 backdrop-blur-md border border-border rounded-full px-2 py-2 shadow-xl">
        <div className="flex gap-2">
          <Button
            onClick={() => onViewChange('home')}
            variant={currentView === 'home' ? 'default' : 'ghost'}
            size="sm"
            className={currentView === 'home' ? 'btn-contest text-sm' : 'text-sm hover:bg-muted/50'}
          >
            <Home className="w-4 h-4 mr-2" />
            Contest
          </Button>
          <Button
            onClick={() => onViewChange('admin')}
            variant={currentView === 'admin' ? 'default' : 'ghost'}
            size="sm"
            className={currentView === 'admin' ? 'btn-admin text-sm' : 'text-sm hover:bg-muted/50'}
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
