
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Users, Sparkles, AlertCircle, Brain, Zap, Network, Star, Rocket } from "lucide-react";
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

    // Check if contest is full (increased to 200)
    const currentCount = getCurrentParticipantCount();
    if (currentCount >= 200) {
      toast({
        title: "Contest Full",
        description: "Sorry, this contest has reached its maximum capacity of 200 participants.",
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
        title: "🎉 Welcome to Neuronex!",
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
  const spotsRemaining = 200 - currentCount;

  return (
    <div className="min-h-screen bg-mesh-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced floating animations with more elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-contest-primary/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-contest-accent/20 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-contest-gold/15 rounded-full blur-4xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-10 right-10 w-36 h-36 bg-contest-secondary/20 rounded-full blur-2xl animate-float delay-500"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-contest-accent/10 rounded-full blur-xl animate-pulse delay-700"></div>
      <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-contest-primary/15 rounded-full blur-2xl animate-float delay-300"></div>
      
      {/* Enhanced animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-contest-accent rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-contest-gold rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-contest-primary rounded-full animate-ping delay-300"></div>
        <div className="absolute top-1/5 right-1/5 w-1.5 h-1.5 bg-contest-secondary rounded-full animate-pulse delay-1200"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-contest-accent rounded-full animate-ping delay-900"></div>
        <div className="absolute bottom-1/3 right-2/3 w-1 h-1 bg-contest-gold rounded-full animate-pulse delay-1500"></div>
      </div>

      {/* Floating stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Star className="absolute top-1/6 left-1/6 w-4 h-4 text-contest-gold/40 animate-pulse" />
        <Star className="absolute top-2/3 right-1/4 w-3 h-3 text-contest-accent/30 animate-pulse delay-500" />
        <Star className="absolute bottom-1/5 left-3/4 w-5 h-5 text-contest-primary/25 animate-pulse delay-1000" />
        <Sparkles className="absolute top-1/3 right-1/6 w-6 h-6 text-contest-secondary/20 animate-spin-slow" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Card className="contest-card animate-slide-in backdrop-blur-xl border-3 border-contest-primary/40 shadow-4xl relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-contest-primary/5 via-contest-accent/10 to-contest-secondary/5 animate-pulse"></div>
          
          <div className="relative z-10 p-8">
            <div className="text-center mb-8">
              {/* Enhanced Neuronex Club Header */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-contest-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <Brain className="w-16 h-16 text-contest-primary animate-pulse relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-contest-accent rounded-full animate-ping"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-contest-gold rounded-full animate-pulse delay-300"></div>
                </div>
                
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-black text-contest-primary mb-2 tracking-wider">NEURONEX CLUB</h3>
                  <div className="flex items-center gap-2 bg-contest-primary/10 px-4 py-2 rounded-full border border-contest-primary/20">
                    <Network className="w-5 h-5 text-contest-accent animate-pulse" />
                    <span className="text-sm text-contest-accent font-bold tracking-wide">Neural Excellence Network</span>
                    <Rocket className="w-4 h-4 text-contest-gold animate-bounce" />
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-contest-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <Zap className="w-16 h-16 text-contest-accent animate-pulse relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-contest-gold rounded-full animate-ping delay-500"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-contest-primary rounded-full animate-pulse delay-700"></div>
                </div>
              </div>

              {/* Enhanced Trophy Section */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-contest-gold/30 rounded-full blur-4xl animate-pulse group-hover:scale-125 transition-all duration-700"></div>
                  <Trophy className="w-24 h-24 text-contest-gold animate-float relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                  <div className="absolute -top-3 -right-3 group-hover:animate-spin">
                    <Sparkles className="w-8 h-8 text-contest-accent animate-spin-slow" />
                  </div>
                  <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-br from-contest-primary to-contest-secondary rounded-full flex items-center justify-center animate-pulse">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute top-0 right-0 w-6 h-6 bg-contest-gold/80 rounded-full animate-ping delay-200"></div>
                </div>
              </div>
              
              <h1 className="text-5xl font-black mb-4 bg-contest-gradient bg-clip-text text-transparent animate-fade-in tracking-tight">
                Vision Prompt
              </h1>
              <p className="text-contest-accent font-bold mb-3 text-xl tracking-wide">
                Smart prompting that bridges vision and intelligence
              </p>
              <div className="bg-gradient-to-r from-contest-primary/10 via-contest-accent/5 to-contest-secondary/10 rounded-full px-6 py-2 border border-contest-primary/30 mb-8">
                <p className="text-sm text-muted-foreground italic font-medium">
                  🎯 Conducted under Neuronex Club Excellence Program
                </p>
              </div>
              
              {/* Enhanced Participation Counter */}
              <div className="bg-gradient-to-br from-muted/80 via-muted/60 to-muted/80 backdrop-blur-lg rounded-3xl p-6 mb-8 border-2 border-contest-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-contest-primary/5 via-transparent to-contest-accent/5 animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-contest-accent animate-pulse" />
                    <span className="text-lg font-black text-contest-primary tracking-wide">LIVE PARTICIPATION</span>
                    <Rocket className="w-5 h-5 text-contest-gold animate-bounce" />
                  </div>
                  
                  <div className="text-5xl font-black mb-4">
                    <span className="bg-gradient-to-r from-contest-primary via-contest-accent to-contest-primary bg-clip-text text-transparent animate-pulse">
                      {currentCount}
                    </span>
                    <span className="text-muted-foreground/60 mx-3 text-3xl">/</span>
                    <span className="text-contest-gold text-4xl">200</span>
                  </div>
                  
                  <div className="w-full bg-muted/80 rounded-full h-4 mb-4 overflow-hidden relative">
                    <div 
                      className="bg-gradient-to-r from-contest-primary via-contest-accent to-contest-gold h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                      style={{ width: `${Math.min((currentCount / 200) * 100, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-contest-gold/20 via-transparent to-contest-accent/20 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {spotsRemaining > 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-contest-accent animate-pulse" />
                      <p className="text-sm text-contest-accent font-bold animate-pulse">
                        🚀 {spotsRemaining} spots remaining - Join the revolution!
                      </p>
                      <Star className="w-4 h-4 text-contest-gold animate-pulse" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-destructive">
                      <AlertCircle className="w-5 h-5 animate-pulse" />
                      <p className="text-sm font-bold">🔥 Contest Full - Maximum Capacity Reached!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {spotsRemaining > 0 ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="name" className="text-base font-black text-contest-primary flex items-center gap-3">
                    <Brain className="w-5 h-5 animate-pulse" />
                    Full Name *
                    <Star className="w-4 h-4 text-contest-gold" />
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="prompt-input border-3 border-contest-primary/40 focus:border-contest-primary focus:ring-4 focus:ring-contest-primary/30 h-14 text-lg rounded-2xl"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="email" className="text-base font-black text-contest-primary flex items-center gap-3">
                    <Network className="w-5 h-5 animate-pulse" />
                    Email Address *
                    <Sparkles className="w-4 h-4 text-contest-accent" />
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="prompt-input border-3 border-contest-primary/40 focus:border-contest-primary focus:ring-4 focus:ring-contest-primary/30 h-14 text-lg rounded-2xl"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || spotsRemaining <= 0}
                  className="btn-contest w-full text-xl py-6 shadow-4xl hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)] hover:scale-105 transition-all duration-500 relative overflow-hidden group rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-contest-gold/30 via-transparent to-contest-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {isSubmitting ? (
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="font-bold">Joining Neuronex Revolution...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 relative z-10">
                      <Brain className="w-6 h-6 animate-pulse" />
                      <span className="font-black">🚀 Join Vision Prompt</span>
                      <Zap className="w-6 h-6 animate-bounce" />
                    </div>
                  )}
                </Button>

                <div className="bg-gradient-to-r from-contest-primary/10 via-contest-accent/10 to-contest-secondary/10 rounded-2xl p-6 border-2 border-contest-primary/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-contest-gold/5 via-transparent to-contest-accent/5 animate-pulse"></div>
                  <p className="text-xs text-center text-muted-foreground leading-relaxed relative z-10">
                    🌟 By registering, you join the <span className="font-black text-contest-primary">Neuronex Club</span> elite community and agree to participate in the Vision Prompt contest. Your submissions will be evaluated for creativity, innovation, and technical excellence. Welcome to the future of AI! 🚀
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl animate-pulse"></div>
                  <AlertCircle className="w-20 h-20 text-destructive mx-auto animate-pulse relative z-10" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-destructive rounded-full animate-ping"></div>
                </div>
                <h3 className="text-2xl font-black text-destructive mb-4">🔥 Contest Full</h3>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                  This exclusive Neuronex Club contest has reached its maximum capacity of <span className="font-bold text-contest-gold">200 participants</span>.
                </p>
                <div className="bg-gradient-to-r from-contest-primary/10 to-contest-accent/10 rounded-2xl p-4 border border-contest-primary/20">
                  <p className="text-sm text-contest-accent font-bold">
                    🚀 Follow Neuronex Club for future contests and exclusive opportunities!
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
