
import { Trophy, Target, Sparkles, Users } from "lucide-react";

const ContestHeader = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient mesh */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-slide-in">
          {/* Main Trophy Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Trophy className="w-20 h-20 text-contest-gold animate-float" />
              <div className="absolute -top-2 -right-2">
                <Target className="w-8 h-8 text-contest-accent animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-contest-gradient bg-clip-text text-transparent">
            Image Recreation Contest
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Can you recreate the reference image with just words? Write the perfect prompt and climb the leaderboard!
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-contest-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-contest-primary" />
              </div>
              <h3 className="font-semibold">Study the Reference</h3>
              <p className="text-sm text-muted-foreground text-center">
                Analyze the reference image carefully to understand what needs to be recreated
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-contest-accent/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-contest-accent" />
              </div>
              <h3 className="font-semibold">Write Your Prompt</h3>
              <p className="text-sm text-muted-foreground text-center">
                Craft a detailed prompt that would generate something similar to the reference
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-contest-gold/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-contest-gold" />
              </div>
              <h3 className="font-semibold">Compete & Win</h3>
              <p className="text-sm text-muted-foreground text-center">
                Get scored on similarity and compete with others for the top spot
              </p>
            </div>
          </div>
          
          {/* Contest Stats */}
          <div className="mt-12 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
            <div className="flex justify-center items-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-contest-primary">AI Powered</div>
                <div className="text-muted-foreground">Image Generation</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-contest-accent">Real-time</div>
                <div className="text-muted-foreground">Similarity Scoring</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-contest-gold">Live</div>
                <div className="text-muted-foreground">Leaderboard</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestHeader;
