
import { useState } from "react";
import ContestHeader from "@/components/ContestHeader";
import PromptSubmission from "@/components/PromptSubmission";
import AdminPanel from "@/components/AdminPanel";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="pt-20">
        {currentView === 'home' ? (
          <div className="space-y-12 pb-20">
            <ContestHeader />
            <PromptSubmission />
          </div>
        ) : (
          <div className="py-20">
            <AdminPanel />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
