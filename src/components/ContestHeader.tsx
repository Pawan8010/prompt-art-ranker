
import { Trophy, Users, LogOut, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContestHeaderProps {
  onLogout?: () => void;
  participantName?: string;
}

const ContestHeader = ({ onLogout, participantName }: ContestHeaderProps) => {
  // Get current participant count
  const getCurrentParticipantCount = () => {
    const submissions = localStorage.getItem('contest-submissions');
    if (submissions) {
      const parsed = JSON.parse(submissions);
      const uniqueParticipants = new Set(parsed.map((sub: any) => sub.participantEmail));
      return uniqueParticipants.size;
    }
    return 0;
  };

  const currentCount = getCurrentParticipantCount();

  return (
    <div className="bg-gradient-to-r from-contest-primary via-contest-accent to-contest-secondary p-6 shadow-4xl border-b-4 border-contest-gold/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-contest-primary/20 via-transparent to-contest-accent/20"></div>
      
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6 relative z-10">
        <div className="flex items-center gap-6">
          {/* Neuronex Club Branding */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-12 h-12 text-contest-gold animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white/90">NEURONEX CLUB</span>
              <span className="text-xs text-white/70">Neural Excellence</span>
            </div>
          </div>
          
          <div className="h-12 w-px bg-white/30"></div>
          
          <div className="flex items-center gap-4">
            <Trophy className="w-10 h-10 text-contest-gold animate-float" />
            <div>
              <h1 className="text-3xl font-bold text-white">Vision Prompt</h1>
              <p className="text-white/80 text-sm">Smart prompting that bridges vision and intelligence</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Live Count Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-contest-gold animate-pulse" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{currentCount}/80</div>
                <div className="text-xs text-white/70">Live Participants</div>
              </div>
            </div>
          </div>

          {/* User Info & Logout */}
          {participantName && onLogout && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-contest-accent" />
                  {participantName}
                </div>
                <div className="text-white/70 text-sm">Neuronex Member</div>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestHeader;
