
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Users, Sparkles, AlertCircle, Brain, Zap, Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegistrationProps {
  onRegistrationComplete: (userData: { name: string; email: string }) => void;
}

const Registration = ({ onRegistrationComplete }: RegistrationProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Check current participant count
  const getCurrentParticipantCount = () => {
    const submissions = localStorage.getItem('contest-submissions');
    if (submissions) {
      const parsed = JSON.parse(submissions);
      const uniqueParticipants = new Set(parsed.map((sub: any) => sub.participantEmail));
      return uniqueParticipants.size;
    }
    return 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both name and email fields.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Check if contest is full
    const currentCount = getCurrentParticipantCount();
    if (currentCount >= 80) {
      toast({
        title: "Contest Full",
        description: "Sorry, this contest has reached its maximum capacity of 80 participants.",
        variant: "destructive"
      });
      return;
    }

    // Check if user is already registered
    const existingParticipants = localStorage.getItem('contest-participants');
    if (existingParticipants) {
      const participants = JSON.parse(existingParticipants);
      const existingParticipant = participants.find((p: any) => p.email === formData.email);
      if (existingParticipant) {
        // Allow re-entry for existing participants
        localStorage.setItem('participant-data', JSON.stringify(formData));
        onRegistrationComplete(formData);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Store participant data
      const participants = existingParticipants ? JSON.parse(existingParticipants) : [];
      participants.push({
        ...formData,
        registeredAt: new Date().toISOString(),
        id: Date.now().toString()
      });
      
      localStorage.setItem('contest-participants', JSON.stringify(participants));
      localStorage.setItem('participant-data', JSON.stringify(formData));

      toast({
        title: "Welcome to Neuronex!",
        description: `Registration successful, ${formData.name}! You can now participate in Vision Prompt.`,
      });

      onRegistrationComplete(formData);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error during registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCount = getCurrentParticipantCount();
  const spotsRemaining = 80 - currentCount;

  return (
    <div className="min-h-screen bg-mesh-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced floating animations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-contest-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-contest-accent/15 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-contest-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-contest-secondary/20 rounded-full blur-2xl animate-float delay-500"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-contest-accent rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-contest-gold rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-contest-primary rounded-full animate-ping delay-300"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="contest-card animate-slide-in backdrop-blur-xl bg-card/95 border-2 border-contest-primary/30 shadow-4xl">
          <div className="text-center mb-8">
            {/* Neuronex Club Header */}
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="relative">
                <Brain className="w-12 h-12 text-contest-primary animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-contest-accent rounded-full animate-ping"></div>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-bold text-contest-primary mb-1">NEURONEX CLUB</h3>
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-contest-accent" />
                  <span className="text-xs text-contest-accent font-medium">Neural Excellence Network</span>
                </div>
              </div>
              <div className="relative">
                <Zap className="w-12 h-12 text-contest-accent animate-pulse" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-contest-gold rounded-full animate-ping delay-500"></div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-contest-gold/20 rounded-full blur-3xl animate-pulse"></div>
                <Trophy className="w-20 h-20 text-contest-gold animate-float relative z-10" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-contest-accent animate-spin-slow" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-contest-primary rounded-full flex items-center justify-center animate-pulse">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-3 bg-contest-gradient bg-clip-text text-transparent animate-fade-in">
              Vision Prompt
            </h1>
            <p className="text-contest-accent font-semibold mb-2 text-lg">
              Smart prompting that bridges vision and intelligence
            </p>
            <p className="text-sm text-muted-foreground mb-6 italic">
              Conducted under Neuronex Club Excellence Program
            </p>
            
            <div className="bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-contest-primary/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Users className="w-5 h-5 text-contest-accent animate-pulse" />
                <span className="text-sm font-bold text-contest-primary">Live Participation</span>
              </div>
              <div className="text-3xl font-black mb-2">
                <span className="bg-gradient-to-r from-contest-primary via-contest-accent to-contest-primary bg-clip-text text-transparent">
                  {currentCount}
                </span>
                <span className="text-muted-foreground mx-2">/</span>
                <span className="text-contest-gold">80</span>
              </div>
              <div className="w-full bg-muted/60 rounded-full h-3 mb-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-contest-primary via-contest-accent to-contest-gold h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                  style={{ width: `${Math.min((currentCount / 80) * 100, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              {spotsRemaining > 0 ? (
                <p className="text-xs text-contest-accent font-medium animate-pulse">
                  ⚡ {spotsRemaining} spots remaining
                </p>
              ) : (
                <div className="flex items-center justify-center gap-1 text-destructive">
                  <AlertCircle className="w-4 h-4 animate-pulse" />
                  <p className="text-xs font-bold">Contest Full</p>
                </div>
              )}
            </div>
          </div>

          {spotsRemaining > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-bold text-contest-primary flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="prompt-input border-2 border-contest-primary/30 focus:border-contest-primary focus:ring-4 focus:ring-contest-primary/20"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-bold text-contest-primary flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="prompt-input border-2 border-contest-primary/30 focus:border-contest-primary focus:ring-4 focus:ring-contest-primary/20"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || spotsRemaining <= 0}
                className="btn-contest w-full text-lg py-4 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-contest-gold/20 via-transparent to-contest-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {isSubmitting ? (
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Joining Neuronex...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 relative z-10">
                    <Brain className="w-5 h-5 animate-pulse" />
                    <span>Join Vision Prompt</span>
                    <Zap className="w-5 h-5" />
                  </div>
                )}
              </Button>

              <div className="bg-gradient-to-r from-contest-primary/5 via-contest-accent/5 to-contest-secondary/5 rounded-xl p-4 border border-contest-primary/20">
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  By registering, you join the <span className="font-bold text-contest-primary">Neuronex Club</span> community and agree to participate in the Vision Prompt contest. Your submissions will be evaluated for creativity and technical excellence.
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="relative mb-6">
                <AlertCircle className="w-16 h-16 text-destructive mx-auto animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full animate-ping"></div>
              </div>
              <h3 className="text-xl font-bold text-destructive mb-3">Contest Full</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This Neuronex Club contest has reached its maximum capacity of 80 participants.
              </p>
              <p className="text-xs text-contest-accent font-medium">
                Follow Neuronex Club for future contests and opportunities!
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Registration;
