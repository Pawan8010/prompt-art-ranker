
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Crown, Medal, Award, Eye, EyeOff, Download, BarChart3, Target } from "lucide-react";
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

  const ADMIN_PASSWORD = "Pawan@8010"; // Updated admin password
  const referenceImage = "https://picsum.photos/512/512?random=42";
  const referencePrompt = "A majestic dragon soaring through a cloudy sunset sky, with golden light illuminating its scales";

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
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

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-contest-gold" />;
      case 1:
        return <Trophy className="w-5 h-5 text-contest-silver" />;
      case 2:
        return <Medal className="w-5 h-5 text-contest-bronze" />;
      default:
        return <Award className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="rank-gold">1st Place</Badge>;
      case 1:
        return <Badge className="rank-silver">2nd Place</Badge>;
      case 2:
        return <Badge className="rank-bronze">3rd Place</Badge>;
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
      <div className="max-w-md mx-auto px-4">
        <Card className="contest-card">
          <div className="text-center mb-6">
            <Crown className="w-12 h-12 mx-auto mb-4 text-contest-gold animate-float" />
            <h2 className="text-2xl font-bold">Admin Access</h2>
            <p className="text-muted-foreground">Enter password to view contest results</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="prompt-input"
            />
            <Button type="submit" className="btn-admin w-full">
              Access Admin Panel
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Admin Header */}
      <Card className="admin-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contest Admin Dashboard</h1>
            <p className="text-blue-100">Total Submissions: {submissions.length}</p>
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
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Reference Image and Prompt */}
      <Card className="contest-card">
        <div className="flex items-start gap-4 mb-4">
          <Target className="w-6 h-6 text-contest-accent mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Contest Reference</h3>
            <p className="text-muted-foreground italic mb-4">"{referencePrompt}"</p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative">
            <img 
              src={referenceImage} 
              alt="Contest reference image" 
              className="w-64 h-64 object-cover rounded-lg border-4 border-contest-primary/20"
            />
            <div className="absolute -top-2 -right-2 bg-contest-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
              Reference
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Participants try to recreate this image with their prompts
        </p>
      </Card>

      {/* Statistics */}
      {submissions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="contest-card text-center">
            <div className="score-display text-3xl mb-2">
              {Math.max(...submissions.map(s => s.score))}
            </div>
            <p className="text-muted-foreground">Highest Score</p>
          </Card>
          <Card className="contest-card text-center">
            <div className="score-display text-3xl mb-2">
              {Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length)}
            </div>
            <p className="text-muted-foreground">Average Score</p>
          </Card>
          <Card className="contest-card text-center">
            <div className="score-display text-3xl mb-2">
              {Math.max(...submissions.map(s => s.similarity || 0))}
            </div>
            <p className="text-muted-foreground">Best Similarity</p>
          </Card>
          <Card className="contest-card text-center">
            <div className="score-display text-3xl mb-2">
              {submissions.length}
            </div>
            <p className="text-muted-foreground">Total Entries</p>
          </Card>
        </div>
      )}

      {/* Leaderboard */}
      <Card className="contest-card">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-contest-gold" />
          <h2 className="text-2xl font-bold">Similarity Contest Leaderboard</h2>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No submissions yet. Waiting for the first contestant!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <Card key={submission.id} className="leaderboard-card">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2 min-w-20">
                    {getRankIcon(index)}
                    {getRankBadge(index)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="score-display text-xl">{submission.score}/100</div>
                        <div className="text-sm text-contest-accent">
                          Similarity: +{submission.similarity || 0} pts
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(submission.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Prompt:</h4>
                        <p className="text-sm text-muted-foreground italic">"{submission.prompt}"</p>
                      </div>
                      
                      {showImages && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">Reference:</h4>
                            <img 
                              src={submission.referenceImage || referenceImage} 
                              alt="Reference" 
                              className="w-32 h-32 object-cover rounded-lg border"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-2">Generated:</h4>
                            <img 
                              src={submission.image} 
                              alt="Generated result" 
                              className="w-32 h-32 object-cover rounded-lg border"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1">AI Feedback:</h4>
                        <p className="text-sm text-muted-foreground">{submission.feedback}</p>
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
  );
};

export default AdminPanel;
