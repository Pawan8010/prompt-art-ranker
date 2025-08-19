
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Users, Sparkles, AlertCircle } from "lucide-react";
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
        title: "Registration Successful!",
        description: `Welcome to Vision Prompt, ${formData.name}! You can now participate in the contest.`,
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
    <div className="min-h-screen bg-mesh-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="contest-card animate-slide-in">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-contest-gold/20 rounded-full blur-2xl animate-pulse"></div>
                <Trophy className="w-20 h-20 text-contest-gold animate-float relative z-10" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-contest-accent animate-pulse" />
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-2 bg-contest-gradient bg-clip-text text-transparent">
              Vision Prompt
            </h1>
            <p className="text-contest-accent font-semibold mb-4">
              Smart prompting that bridges vision and intelligence
            </p>
            
            <div className="bg-muted/50 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-4 h-4 text-contest-accent" />
                <span className="text-sm font-medium">Contest Capacity</span>
              </div>
              <div className="text-2xl font-bold text-contest-primary mb-1">
                {currentCount} / 80
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className="bg-contest-gradient h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((currentCount / 80) * 100, 100)}%` }}
                ></div>
              </div>
              {spotsRemaining > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {spotsRemaining} spots remaining
                </p>
              ) : (
                <div className="flex items-center justify-center gap-1 text-destructive">
                  <AlertCircle className="w-3 h-3" />
                  <p className="text-xs font-medium">Contest Full</p>
                </div>
              )}
            </div>
          </div>

          {spotsRemaining > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="prompt-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="prompt-input"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || spotsRemaining <= 0}
                className="btn-contest w-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>Join the Contest</span>
                  </div>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By registering, you agree to participate in the Vision Prompt contest. 
                Your submissions will be evaluated for similarity and creativity.
              </p>
            </form>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-bold text-destructive mb-2">Contest Full</h3>
              <p className="text-sm text-muted-foreground">
                This contest has reached its maximum capacity of 80 participants. 
                Please check back for future contests.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Registration;
