
import { useState, useEffect } from "react";
import ContestHeader from "@/components/ContestHeader";
import PromptSubmission from "@/components/PromptSubmission";
import AdminPanel from "@/components/AdminPanel";
import Navigation from "@/components/Navigation";
import Registration from "@/components/Registration";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Always start with registration - don't auto-login
    setIsRegistered(false);
  }, []);

  const handleRegistrationComplete = (userData: { name: string; email: string }) => {
    setIsRegistered(true);
  };

  // Always show registration first for login
  if (!isRegistered && currentView === 'home') {
    return <Registration onRegistrationComplete={handleRegistrationComplete} />;
  }

  return (
    <div className="min-h-screen bg-background bg-mesh-gradient">
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
