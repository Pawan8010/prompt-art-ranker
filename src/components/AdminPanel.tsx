import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Crown, Medal, Award, Eye, EyeOff, Download, BarChart3, Target, Sparkles, Users, Upload, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: number;
  prompt: string;
  image: string;
  referenceImage: string;
  score: number;
  feedback: string;
  similarity: number;
  timestamp: string;
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showImages, setShowImages] = useState(true);
  const [newTargetImage, setNewTargetImage] = useState("");
  const [newTargetPrompt, setNewTargetPrompt] = useState("");

  const ADMIN_PASSWORD = "Pawan@8010";
  
  // Get current target image and prompt from localStorage, with fallbacks
  const getCurrentTarget = () => {
    const stored = localStorage.getItem('contest-target');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        image: parsed.image || "https://picsum.photos/512/512?random=42",
        prompt: parsed.prompt || "A majestic dragon soaring through a cloudy sunset sky, with golden light illuminating its scales"
      };
    }
    return {
      image: "https://picsum.photos/512/512?random=42",
      prompt: "A majestic dragon soaring through a cloudy sunset sky, with golden light illuminating its scales"
    };
  };

  const [currentTarget, setCurrentTarget] = useState(getCurrentTarget());

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
      setCurrentTarget(getCurrentTarget());
    }
  }, [isAuthenticated]);

  const loadSubmissions = () => {
    const stored = JSON.parse(localStorage.getItem('contest-submissions') || '[]');
    const sorted = stored.sort((a: Submission, b: Submission) => b.score - a.score);
    setSubmissions(sorted);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Welcome to the admin panel!");
    } else {
      toast.error("Invalid password");
    }
  };

  const handleUpdateTarget = () => {
    if (!newTargetImage.trim()) {
      toast.error("Please enter a target image URL");
      return;
    }

    const targetData = {
      image: newTargetImage.trim(),
      prompt: newTargetPrompt.trim() || "Recreate this image with your best descriptive prompt"
    };

    localStorage.setItem('contest-target', JSON.stringify(targetData));
    setCurrentTarget(targetData);
    setNewTargetImage("");
    setNewTargetPrompt("");
    toast.success("Target image updated successfully! Participants will now see the new challenge.");
  };

  const handleResetContest = () => {
    if (confirm("Are you sure you want to clear all submissions? This action cannot be undone.")) {
      localStorage.removeItem('contest-submissions');
      setSubmissions([]);
      toast.success("Contest reset successfully!");
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-contest-gold animate-pulse" />;
      case 1:
        return <Trophy className="w-6 h-6 text-contest-silver" />;
      case 2:
        return <Medal className="w-6 h-6 text-contest-bronze" />;
      default:
        return <Award className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="rank-gold animate-pulse">🏆 WINNER</Badge>;
      case 1:
        return <Badge className="rank-silver">🥈 2nd Place</Badge>;
      case 2:
        return <Badge className="rank-bronze">🥉 3rd Place</Badge>;
      default:
        return <Badge className="rank-default">#{index + 1}</Badge>;
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Rank', 'Score', 'Similarity', 'Prompt', 'Timestamp'],
      ...submissions.map((sub, idx) => [
        idx + 1,
        sub.score,
        sub.similarity || 0,
        `"${sub.prompt}"`,
        new Date(sub.timestamp).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contest-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Results exported successfully!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="contest-card animate-slide-in">
            <div className="text-center mb-8">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <Crown className="w-24 h-24 text-contest-gold animate-float" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-contest-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-contest-gradient bg-clip-text text-transparent">
                Admin Portal
              </h2>
              <p className="text-muted-foreground">Enter your credentials to access the contest dashboard</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Admin Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="prompt-input"
                />
              </div>
              <Button type="submit" className="btn-admin w-full text-lg py-3">
                <Crown className="w-5 h-5 mr-2" />
                Access Dashboard
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Enhanced Admin Header */}
        <Card className="admin-header animate-slide-in">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Trophy className="w-12 h-12 text-contest-gold animate-float" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-contest-accent rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 text-white">Contest Control Center</h1>
                <div className="flex items-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Total Participants: {submissions.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Active Competition</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowImages(!showImages)}
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10"
              >
                {showImages ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showImages ? 'Hide Images' : 'Show Images'}
              </Button>
              <Button onClick={exportData} variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>
        </Card>

        {/* Target Image Management Section */}
        <Card className="contest-card animate-slide-in">
          <div className="flex items-center gap-4 mb-6">
            <Target className="w-8 h-8 text-contest-accent" />
            <h2 className="text-2xl font-bold bg-contest-gradient bg-clip-text text-transparent">
              Contest Target Management
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-contest-accent to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-contest-primary">Current Target Image</h3>
              <div className="relative">
                <img 
                  src={currentTarget.image} 
                  alt="Current target image" 
                  className="w-full max-w-sm h-64 object-cover rounded-xl border-4 border-contest-primary/30 shadow-xl mx-auto"
                />
                <div className="absolute -top-3 -right-3 bg-contest-primary text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  ACTIVE
                </div>
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Current Description:</h4>
                <p className="text-sm text-muted-foreground italic">"{currentTarget.prompt}"</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-contest-accent">Update Target Image</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="targetImage" className="block text-sm font-medium mb-2">
                    New Target Image URL
                  </label>
                  <Input
                    id="targetImage"
                    type="url"
                    value={newTargetImage}
                    onChange={(e) => setNewTargetImage(e.target.value)}
                    placeholder="https://example.com/new-target-image.jpg"
                    className="prompt-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="targetPrompt" className="block text-sm font-medium mb-2">
                    Reference Description (Optional)
                  </label>
                  <Input
                    id="targetPrompt"
                    value={newTargetPrompt}
                    onChange={(e) => setNewTargetPrompt(e.target.value)}
                    placeholder="Describe what participants should recreate..."
                    className="prompt-input"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleUpdateTarget} className="btn-admin flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Update Target
                  </Button>
                  <Button onClick={handleResetContest} variant="destructive" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Contest
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Statistics Dashboard */}
        {submissions.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
            <Card className="contest-card text-center hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-3">
                <Trophy className="w-8 h-8 text-contest-gold mr-2" />
                <span className="text-sm text-muted-foreground">Best Score</span>
              </div>
              <div className="score-display text-4xl mb-2">
                {Math.max(...submissions.map(s => s.score))}
              </div>
              <p className="text-xs text-muted-foreground">Out of 100</p>
            </Card>
            
            <Card className="contest-card text-center hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-3">
                <BarChart3 className="w-8 h-8 text-contest-accent mr-2" />
                <span className="text-sm text-muted-foreground">Average</span>
              </div>
              <div className="score-display text-4xl mb-2">
                {Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length)}
              </div>
              <p className="text-xs text-muted-foreground">Mean Score</p>
            </Card>
            
            <Card className="contest-card text-center hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-3">
                <Target className="w-8 h-8 text-contest-primary mr-2" />
                <span className="text-sm text-muted-foreground">Top Similarity</span>
              </div>
              <div className="score-display text-4xl mb-2">
                {Math.max(...submissions.map(s => s.similarity || 0))}%
              </div>
              <p className="text-xs text-muted-foreground">Match Rate</p>
            </Card>
            
            <Card className="contest-card text-center hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-contest-secondary mr-2" />
                <span className="text-sm text-muted-foreground">Participants</span>
              </div>
              <div className="score-display text-4xl mb-2">
                {submissions.length}
              </div>
              <p className="text-xs text-muted-foreground">Total Entries</p>
            </Card>
          </div>
        )}

        {/* Winner Showcase */}
        {submissions.length > 0 && (
          <Card className="contest-card animate-slide-in">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Crown className="w-10 h-10 text-contest-gold animate-pulse" />
                <h2 className="text-4xl font-bold bg-gradient-to-r from-contest-gold to-contest-secondary bg-clip-text text-transparent">
                  🏆 CHAMPION 🏆
                </h2>
                <Crown className="w-10 h-10 text-contest-gold animate-pulse" />
              </div>
              
              {submissions[0] && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-r from-contest-gold/20 to-contest-secondary/20 rounded-2xl p-8 border-4 border-contest-gold/30">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Badge className="rank-gold text-lg px-6 py-2 animate-pulse">
                        🏆 WINNER - SCORE: {submissions[0].score}/100
                      </Badge>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3 text-contest-gold">Winning Prompt:</h3>
                      <p className="text-lg italic bg-contest-gold/10 rounded-xl p-6 border border-contest-gold/30">
                        "{submissions[0].prompt}"
                      </p>
                    </div>
                    
                    {showImages && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        <div className="text-center">
                          <h4 className="font-semibold mb-3 text-contest-accent">Reference Image</h4>
                          <img 
                            src={submissions[0].referenceImage || currentTarget.image} 
                            alt="Reference" 
                            className="w-full max-w-64 h-64 object-cover rounded-xl border-2 border-contest-accent/30 mx-auto"
                          />
                        </div>
                        <div className="text-center">
                          <h4 className="font-semibold mb-3 text-contest-gold">Winner's Creation</h4>
                          <img 
                            src={submissions[0].image} 
                            alt="Winner's result" 
                            className="w-full max-w-64 h-64 object-cover rounded-xl border-4 border-contest-gold/50 mx-auto shadow-2xl"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">🎉 Congratulations to our champion! 🎉</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(submissions[0].timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Full Leaderboard at the End */}
        <Card className="contest-card animate-slide-in">
          <div className="flex items-center gap-4 mb-8">
            <Trophy className="w-8 h-8 text-contest-gold" />
            <h2 className="text-3xl font-bold bg-contest-gradient bg-clip-text text-transparent">
              Complete Leaderboard
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-contest-primary to-transparent"></div>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No Submissions Yet</h3>
              <p className="text-muted-foreground">The competition is just getting started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission, index) => (
                <Card 
                  key={submission.id} 
                  className={`leaderboard-card hover:scale-[1.02] transition-all duration-300 ${
                    index === 0 ? 'ring-2 ring-contest-gold/50 bg-contest-gold/5' :
                    index === 1 ? 'ring-2 ring-contest-silver/50 bg-contest-silver/5' :
                    index === 2 ? 'ring-2 ring-contest-bronze/50 bg-contest-bronze/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center gap-3 min-w-24">
                      {getRankIcon(index)}
                      {getRankBadge(index)}
                      <div className="text-center">
                        <div className="score-display text-2xl">{submission.score}</div>
                        <div className="text-xs text-muted-foreground">/ 100</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-contest-accent font-medium">
                            Similarity: {submission.similarity || 0}% match
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(submission.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-contest-accent" />
                            Participant's Prompt:
                          </h4>
                          <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg border-l-4 border-contest-accent/30">
                            "{submission.prompt}"
                          </p>
                        </div>
                        
                        {showImages && (
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-sm mb-3 text-contest-accent">Reference:</h4>
                              <img 
                                src={submission.referenceImage || currentTarget.image} 
                                alt="Reference" 
                                className="w-full h-40 object-cover rounded-xl border border-contest-accent/30"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm mb-3 text-contest-primary">Generated:</h4>
                              <img 
                                src={submission.image} 
                                alt="Generated result" 
                                className="w-full h-40 object-cover rounded-xl border border-contest-primary/30 shadow-lg"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-contest-secondary" />
                            AI Analysis:
                          </h4>
                          <p className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg">
                            {submission.feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
