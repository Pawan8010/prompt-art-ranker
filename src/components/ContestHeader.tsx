
import { Trophy, Target, Sparkles, Users, Crown, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const ContestHeader = () => {
  return (
    <div className="relative overflow-hidden min-h-screen flex items-center">
      {/* Enhanced background with multiple gradients */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-contest-primary/20 via-transparent to-contest-secondary/20"></div>
      
      {/* Floating decoration elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-contest-accent/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-contest-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="animate-slide-in">
          {/* Enhanced Main Trophy Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-contest-gold/20 rounded-full blur-2xl animate-pulse"></div>
              <Trophy className="w-28 h-28 text-contest-gold animate-float relative z-10" />
              <div className="absolute -top-4 -right-4 animate-spin-slow">
                <Crown className="w-12 h-12 text-contest-accent" />
              </div>
              <div className="absolute -bottom-2 -left-4">
                <Sparkles className="w-8 h-8 text-contest-secondary animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Enhanced Title */}
          <div className="mb-6">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-contest-gradient bg-clip-text text-transparent relative">
              Image Recreation
              <div className="absolute -inset-4 bg-gradient-to-r from-contest-primary/20 via-contest-accent/20 to-contest-secondary/20 rounded-2xl blur-xl -z-10"></div>
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-1 w-20 bg-contest-gradient rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-contest-accent">CONTEST</h2>
              <div className="h-1 w-20 bg-contest-gradient rounded-full"></div>
            </div>
          </div>
          
          {/* Enhanced Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            🎯 Can you recreate the reference image with just words? 
            <br />
            <span className="text-contest-accent font-semibold">Write the perfect prompt and climb to victory!</span>
          </p>
          
          {/* Enhanced Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-16">
            <Card className="contest-card hover-lift group">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-contest-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-contest-primary/30 transition-all duration-300">
                  <Target className="w-8 h-8 text-contest-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-contest-primary">🔍 Analyze & Study</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Carefully examine the reference image to understand every detail, color, and composition that needs to be recreated
                </p>
              </div>
            </Card>
            
            <Card className="contest-card hover-lift group">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-contest-accent/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-contest-accent/30 transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-contest-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-contest-accent">✨ Craft Your Prompt</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Write a detailed, creative prompt that captures the essence and details of the reference image perfectly
                </p>
              </div>
            </Card>
            
            <Card className="contest-card hover-lift group">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-contest-gold/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-contest-gold/30 transition-all duration-300">
                  <Trophy className="w-8 h-8 text-contest-gold group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-contest-gold">👑 Compete & Win</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get scored on similarity and creativity. Rise through the ranks to become the ultimate prompt champion!
                </p>
              </div>
            </Card>
          </div>
          
          {/* Enhanced Contest Stats */}
          <Card className="contest-card max-w-4xl mx-auto shimmer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-contest-primary/5 via-contest-accent/5 to-contest-secondary/5 rounded-xl"></div>
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="group hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Zap className="w-8 h-8 text-contest-primary animate-pulse" />
                    <div className="text-3xl font-bold text-contest-primary">AI Powered</div>
                  </div>
                  <div className="text-muted-foreground font-medium">Advanced Image Generation</div>
                </div>
                
                <div className="md:border-x border-border/50 group hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Target className="w-8 h-8 text-contest-accent animate-pulse delay-300" />
                    <div className="text-3xl font-bold text-contest-accent">Real-time</div>
                  </div>
                  <div className="text-muted-foreground font-medium">Instant Similarity Scoring</div>
                </div>
                
                <div className="group hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Crown className="w-8 h-8 text-contest-gold animate-pulse delay-500" />
                    <div className="text-3xl font-bold text-contest-gold">Live</div>
                  </div>
                  <div className="text-muted-foreground font-medium">Dynamic Leaderboard</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <div className="mt-16">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-contest-gradient rounded-full text-white font-bold text-lg shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <Trophy className="w-6 h-6" />
              <span>Ready to Compete?</span>
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Scroll down to see the challenge and submit your best prompt!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestHeader;
