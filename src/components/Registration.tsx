
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Mail, Sparkles, CheckCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";

const Registration = ({ onRegistrationComplete }: { onRegistrationComplete: (userData: { name: string; email: string }) => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save participant data
      const participantData = {
        name: name.trim(),
        email: email.trim(),
        registrationTime: new Date().toISOString()
      };
      
      localStorage.setItem('participant-data', JSON.stringify(participantData));
      
      toast.success(`Welcome ${name}! You're now registered for the contest.`);
      onRegistrationComplete(participantData);
      
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-contest-primary/10 via-contest-accent/10 to-contest-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="contest-card shimmer">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-contest-primary to-contest-accent rounded-full flex items-center justify-center animate-float">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-contest-primary to-contest-accent bg-clip-text text-transparent">
              Join the Contest
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Register to participate in our creative prompt challenge
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-contest-primary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="prompt-input"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-contest-primary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="prompt-input"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="bg-contest-primary/10 rounded-lg p-4 border border-contest-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-contest-primary" />
                  <span className="text-sm font-semibold text-contest-primary">Contest Rules</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Write creative prompts to recreate reference images</li>
                  <li>• Higher accuracy scores earn better rankings</li>
                  <li>• Results will be displayed on the leaderboard</li>
                  <li>• Have fun and be creative!</li>
                </ul>
              </div>
              
              <Button 
                type="submit" 
                className="btn-contest w-full"
                disabled={isSubmitting || !name.trim() || !email.trim()}
              >
                {isSubmitting ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register for Contest
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
