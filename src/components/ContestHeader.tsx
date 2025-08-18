
import { Trophy, Zap, Target } from "lucide-react";

const ContestHeader = () => {
  return (
    <header className="relative overflow-hidden py-20 px-4">
      <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 animate-float">
          <Trophy className="w-8 h-8 text-contest-gold" />
          <span className="text-contest-accent font-semibold text-lg">Prompt Master Challenge</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-contest-primary via-contest-accent to-contest-secondary bg-clip-text text-transparent">
          Test Your Creativity
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Submit your best prompt, get an AI-generated image, and see how you rank against other creators. 
          The most creative and accurate prompts win!
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-contest-accent" />
            <span>Real-time scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-contest-accent" />
            <span>AI-powered evaluation</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-contest-gold" />
            <span>Live leaderboard</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ContestHeader;
