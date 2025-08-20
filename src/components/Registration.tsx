
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trophy, Sparkles, Users, Crown, Star } from "lucide-react";
import { toast } from "sonner";

interface RegistrationProps {
  onRegistrationComplete: (userData: { name: string; email: string }) => void;
}

const Registration = ({ onRegistrationComplete }: RegistrationProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Get current participant count
    const existingParticipants = JSON.parse(localStorage.getItem('contest-participants') || '[]');
    
    // Check if already registered
    const existingUser = existingParticipants.find((p: any) => p.email === email.trim());
    if (existingUser) {
      // Login existing user with complete data
      const userData = { 
        name: existingUser.name, 
        email: existingUser.email,
        participantId: existingUser.participantId,
        registrationTime: existingUser.registrationTime
      };
      localStorage.setItem('participant-data', JSON.stringify(userData));
      toast.success(`Welcome back, ${existingUser.name}! 🎉`);
      onRegistrationComplete(userData);
      setIsLoading(false);
      return;
    }

    // Check participant limit (set to 200)
    if (existingParticipants.length >= 200) {
      toast.error("Contest is full! Maximum 200 participants allowed.");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = { 
        name: name.trim(), 
        email: email.trim(),
        registrationTime: new Date().toISOString(),
        participantId: existingParticipants.length + 1 // Sequential ID
      };
      
      // Store participant data
      localStorage.setItem('participant-data', JSON.stringify(userData));
      
      // Add to participants list
      existingParticipants.push(userData);
      localStorage.setItem('contest-participants', JSON.stringify(existingParticipants));
      
      toast.success(`Welcome to Prompt Craft Challenge, ${name}! 🎨✨`);
      onRegistrationComplete(userData);
      
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get current participant count for display
  const currentParticipants = JSON.parse(localStorage.getItem('contest-participants') || '[]').length;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-mesh-gradient">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-contest-primary/10 via-transparent to-contest-secondary/10"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-contest-gold/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-contest-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-contest-primary/30 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      <div className="w-full max-w-md relative z-10">
        <Card className="contest-card animate-slide-in backdrop-blur-sm bg-card/95 border-2 border-contest-primary/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-contest-primary/20 rounded-full blur-xl animate-pulse"></div>
              <Trophy className="w-32 h-32 text-contest-primary animate-float relative z-10" />
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-contest-accent rounded-full flex items-center justify-center animate-spin-slow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-contest-secondary rounded-full flex items-center justify-center animate-pulse">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 bg-contest-gradient bg-clip-text text-transparent">
              Prompt Craft Challenge
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-1 w-12 bg-contest-gradient rounded-full"></div>
              <Crown className="w-5 h-5 text-contest-gold" />
              <div className="h-1 w-12 bg-contest-gradient rounded-full"></div>
            </div>
            
            <p className="text-muted-foreground text-lg mb-6">
              Join the ultimate AI prompt engineering contest!
            </p>
            
            {/* Participant counter */}
            <div className="flex items-center justify-center gap-2 mb-6 bg-contest-primary/10 rounded-full px-4 py-2">
              <Users className="w-5 h-5 text-contest-primary" />
              <span className="text-contest-primary font-semibold">
                {currentParticipants}/200 Participants
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Crown className="w-4 h-4 text-contest-accent" />
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="prompt-input text-lg py-3 border-2 border-contest-primary/30 focus:border-contest-primary"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-contest-secondary" />
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="prompt-input text-lg py-3 border-2 border-contest-secondary/30 focus:border-contest-secondary"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="btn-contest w-full text-lg py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
              disabled={isLoading || !name.trim() || !email.trim()}
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 mr-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Joining Contest...
                </>
              ) : (
                <>
                  <Trophy className="w-6 h-6 mr-3" />
                  Join Challenge
                  <Sparkles className="w-6 h-6 ml-3 animate-pulse" />
                </>
              )}
            </Button>
          </form>
          
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>✨ Create amazing prompts and compete for the top spot! ✨</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
