import { useState, useEffect } from "react";
import Registration from "@/components/Registration";
import PromptSubmission from "@/components/PromptSubmission";
import ContestHeader from "@/components/ContestHeader";

const Index = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUserData = localStorage.getItem('participant-data');
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData);
      setUserData(parsed);
      setIsRegistered(true);
    }
  }, []);

  const handleRegistrationComplete = (userData: { name: string; email: string }) => {
    setUserData(userData);
    setIsRegistered(true);
  };

  const handleLogout = () => {
    // Clear user session but keep participant data for potential re-login
    setIsRegistered(false);
    setUserData(null);
  };

  // Always show registration for non-registered users or if explicitly logged out
  if (!isRegistered || !userData) {
    return <Registration onRegistrationComplete={handleRegistrationComplete} />;
  }

  return (
    <div className="min-h-screen bg-mesh-gradient">
      <ContestHeader onLogout={handleLogout} participantName={userData.name} />
      <PromptSubmission participantData={userData} />
    </div>
  );
};

export default Index;
