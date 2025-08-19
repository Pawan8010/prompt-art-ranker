
import { Trophy, Users, LogOut, Brain, Zap, Sparkles, Star } from "lucide-react";
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
    <div className="bg-gradient-to-r from-contest-primary via-contest-accent to-contest-secondary p-8 shadow-4xl border-b-4 border-contest-gold/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-contest-primary/30 via-transparent to-contest-accent/30 animate-pulse"></div>
      
      {/* Enhanced floating elements */}
      <div className="absolute top-4 left-20 w-3 h-3 bg-contest-gold rounded-full animate-ping"></div>
      <div className="absolute bottom-6 right-32 w-2 h-2 bg-white rounded-full animate-pulse delay-700"></div>
      <div className="absolute top-8 right-20 w-1.5 h-1.5 bg-contest-accent rounded-full animate-ping delay-500"></div>
      <Star className="absolute top-6 left-40 w-4 h-4 text-contest-gold/60 animate-pulse" />
      <Sparkles className="absolute bottom-4 left-60 w-5 h-5 text-white/40 animate-spin-slow" />
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex items-center gap-8">
          {/* Enhanced Neuronex Club Branding */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-contest-gold/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Brain className="w-16 h-16 text-contest-gold animate-pulse relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-contest-accent rounded-full animate-pulse delay-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-wider mb-1">NEURONEX CLUB</span>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-contest-gold animate-pulse" />
                <span className="text-sm text-white/90 font-bold">Neural Excellence Network</span>
                <Sparkles className="w-3 h-3 text-contest-accent animate-pulse delay-500" />
              </div>
            </div>
          </div>
          
          <div className="h-16 w-px bg-white/40"></div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Trophy className="w-14 h-14 text-contest-gold animate-float group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-contest-accent rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-1">Vision Prompt</h1>
              <p className="text-white/90 text-base font-bold">Smart prompting that bridges vision and intelligence</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Enhanced Live Count Display */}
          <div className="bg-white/15 backdrop-blur-lg rounded-3xl px-8 py-4 border-2 border-white/30 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-contest-gold/20 via-transparent to-contest-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <Users className="w-8 h-8 text-contest-gold animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-contest-accent rounded-full animate-ping"></div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-white mb-1">
                  <span className="bg-gradient-to-r from-contest-gold via-white to-contest-gold bg-clip-text text-transparent animate-pulse">
                    {currentCount}
                  </span>
                  <span className="text-white/60 mx-2 text-xl">/</span>
                  <span className="text-contest-gold text-2xl">200</span>
                </div>
                <div className="text-xs text-white/80 font-bold tracking-wide">Live Participants</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-contest-gold to-contest-accent h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                    style={{ width: `${Math.min((currentCount / 200) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced User Info & Logout */}
          {participantName && onLogout && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-white font-black flex items-center gap-3 text-lg">
                  <div className="relative">
                    <Zap className="w-5 h-5 text-contest-accent animate-pulse" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-contest-gold rounded-full animate-ping"></div>
                  </div>
                  {participantName}
                  <Star className="w-4 h-4 text-contest-gold animate-pulse" />
                </div>
                <div className="text-white/80 text-sm font-bold tracking-wide">Neuronex Elite Member</div>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="bg-white/15 border-2 border-white/40 text-white hover:bg-white/25 backdrop-blur-lg py-3 px-6 rounded-2xl font-bold hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-contest-gold/20 via-transparent to-contest-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <LogOut className="w-5 h-5 mr-3 relative z-10" />
                <span className="relative z-10">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestHeader;
