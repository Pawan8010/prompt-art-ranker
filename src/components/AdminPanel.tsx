import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Crown, Medal, Award, Eye, EyeOff, Download, BarChart3, Target, Sparkles, Users, Upload, Save, RefreshCw, ImageIcon, Star, Brain, Shield, Lock } from "lucide-react";
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
  const [imagePreview, setImagePreview] = useState("");

  const ADMIN_PASSWORD = "Pawan@8010";
  const ADMIN_EMAIL = "rajputpawan9765@gmail.com";
  
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
      toast.success("🛡️ Welcome to Neuronex Admin Portal!");
    } else {
      toast.error("❌ Unauthorized access attempt detected");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setNewTargetImage(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewTargetImage(url);
    setImagePreview(url);
  };

  const handleUpdateTarget = () => {
    if (!newTargetImage.trim()) {
      toast.error("Please enter a target image URL or upload an image");
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
    setImagePreview("");
    toast.success("🎯 Target image updated successfully! Participants will now see the new challenge.");
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
    a.download = `neuronex-vision-prompt-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("📊 Results exported successfully!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Enhanced secure background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-gray-900 to-blue-900/20"></div>
        <div className="absolute inset-0 bg-mesh-gradient opacity-20"></div>
        
        {/* Security-themed floating decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-yellow-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        <div className="w-full max-w-md relative z-10">
          <Card className="contest-card animate-slide-in backdrop-blur-xl bg-gray-900/95 border-2 border-red-500/30 shadow-4xl">
            <div className="text-center mb-8">
              {/* Neuronex Admin Header */}
              <div className="flex justify-center items-center gap-3 mb-6">
                <Brain className="w-8 h-8 text-contest-primary" />
                <div className="text-center">
                  <h3 className="text-lg font-bold text-contest-primary">NEURONEX CLUB</h3>
                  <p className="text-xs text-contest-accent">Neural Excellence Network</p>
                </div>
                <Shield className="w-8 h-8 text-red-400" />
              </div>

              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute inset-4 bg-yellow-500/20 rounded-full blur-lg animate-pulse delay-300"></div>
                <Lock className="w-32 h-32 text-red-400 animate-float relative z-10" />
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-spin-slow border-4 border-red-400">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                  <Star className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                🛡️ ADMIN PORTAL 🛡️
              </h2>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full"></div>
                <Lock className="w-5 h-5 text-red-400 animate-pulse" />
                <div className="h-1 w-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"></div>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-200 text-sm font-medium mb-2">🔒 RESTRICTED ACCESS</p>
                <p className="text-gray-300 text-xs">Authorized Personnel Only</p>
                <p className="text-gray-400 text-xs mt-1">Contact: {ADMIN_EMAIL}</p>
              </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="password" className="text-sm font-bold text-red-200 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  Security Passphrase
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin passphrase"
                  className="bg-gray-800/50 border-2 border-red-500/30 text-white placeholder-gray-400 text-center text-lg py-4 focus:border-red-400 focus:ring-4 focus:ring-red-500/20"
                />
              </div>
              <Button type="submit" className="w-full text-lg py-4 bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 text-white font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Lock className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10">AUTHENTICATE ACCESS</span>
                <Shield className="w-6 h-6 ml-3 animate-pulse relative z-10" />
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Neuronex Club Vision Prompt Administration
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 space-y-8 relative z-10">
        {/* Enhanced Admin Header with Neuronex branding */}
        <Card className="admin-header animate-slide-in relative overflow-hidden border-4 border-contest-primary/40">
          <div className="absolute inset-0 bg-gradient-to-r from-contest-primary/30 via-contest-accent/20 to-contest-secondary/30"></div>
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              {/* Neuronex Admin Branding */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Brain className="w-12 h-12 text-contest-gold animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white">NEURONEX CLUB</span>
                  <span className="text-sm text-blue-200">Admin Dashboard</span>
                </div>
              </div>
              
              <div className="h-16 w-px bg-white/30"></div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-contest-gold/30 rounded-full blur-xl animate-pulse"></div>
                <Trophy className="w-16 h-16 text-contest-gold animate-float relative z-10" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-contest-accent rounded-full flex items-center justify-center animate-spin-slow">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-3 text-white">Vision Prompt Control</h1>
                <div className="flex items-center gap-6 text-blue-100 text-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>Participants: {submissions.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Live Contest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 animate-pulse" />
                    <span>Neural Excellence</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowImages(!showImages)}
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
              >
                {showImages ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showImages ? 'Hide Images' : 'Show Images'}
              </Button>
              <Button onClick={exportData} variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>
        </Card>

        {/* Enhanced Target Image Management Section */}
        <Card className="contest-card animate-slide-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-contest-accent/5 via-transparent to-contest-primary/5"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <Target className="w-10 h-10 text-contest-accent animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-contest-gold rounded-full animate-ping"></div>
              </div>
              <h2 className="text-3xl font-bold bg-contest-gradient bg-clip-text text-transparent">
                Contest Target Management
              </h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-contest-accent via-contest-primary to-transparent rounded-full"></div>
              <Sparkles className="w-6 h-6 text-contest-secondary animate-pulse" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-6 text-contest-primary flex items-center justify-center gap-3">
                    <ImageIcon className="w-6 h-6" />
                    Current Target Image
                  </h3>
                  <div className="relative mx-auto max-w-sm">
                    <img 
                      src={currentTarget.image} 
                      alt="Current target image" 
                      className="w-full h-80 object-cover rounded-2xl border-4 border-contest-primary/30 shadow-2xl transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute -top-4 -right-4 bg-contest-primary text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-xl">
                      🎯 ACTIVE
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-contest-gold text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      LIVE TARGET
                    </div>
                  </div>
                  <div className="mt-6 p-6 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-contest-primary/20">
                    <h4 className="font-semibold text-lg mb-3 text-contest-primary flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Current Description
                    </h4>
                    <p className="text-muted-foreground italic text-lg leading-relaxed">"{currentTarget.prompt}"</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-contest-accent flex items-center gap-3">
                  <Upload className="w-6 h-6" />
                  Update Target Image
                </h3>
                
                <div className="space-y-6">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium mb-2 text-contest-primary">
                      Upload New Image
                    </label>
                    <div className="border-2 border-dashed border-contest-accent/30 rounded-xl p-6 text-center hover:border-contest-accent/50 transition-colors duration-300">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label htmlFor="imageUpload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-contest-accent" />
                        <p className="text-contest-accent font-medium">Click to upload image</p>
                        <p className="text-sm text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                      </label>
                    </div>
                  </div>

                  <div className="text-center text-muted-foreground font-medium">OR</div>

                  {/* URL Input Section */}
                  <div>
                    <label htmlFor="targetImage" className="block text-sm font-medium mb-2 text-contest-primary">
                      Image URL
                    </label>
                    <Input
                      id="targetImage"
                      type="url"
                      value={newTargetImage}
                      onChange={handleImageUrlChange}
                      placeholder="https://example.com/new-target-image.jpg"
                      className="prompt-input border-2 border-contest-accent/30 focus:border-contest-accent"
                    />
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-contest-secondary">Preview:</h4>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full max-w-xs h-48 object-cover rounded-xl border-2 border-contest-secondary/30 shadow-lg mx-auto"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="targetPrompt" className="block text-sm font-medium mb-2 text-contest-primary">
                      Reference Description (Optional)
                    </label>
                    <Input
                      id="targetPrompt"
                      value={newTargetPrompt}
                      onChange={(e) => setNewTargetPrompt(e.target.value)}
                      placeholder="Describe what participants should recreate..."
                      className="prompt-input border-2 border-contest-primary/30 focus:border-contest-primary"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleUpdateTarget} className="btn-admin flex-1 text-lg py-3 shadow-xl hover:shadow-2xl">
                      <Save className="w-5 h-5 mr-2" />
                      Update Target
                      <Target className="w-5 h-5 ml-2" />
                    </Button>
                    <Button onClick={handleResetContest} variant="destructive" className="flex-1 text-lg py-3 shadow-xl hover:shadow-2xl">
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Reset Contest
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Statistics Dashboard */}
        {submissions.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
            <Card className="contest-card text-center hover:scale-105 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-contest-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="w-10 h-10 text-contest-gold mr-2 animate-pulse" />
                  <span className="text-sm text-muted-foreground font-medium">Best Score</span>
                </div>
                <div className="score-display text-5xl mb-3 text-contest-gold">
                  {Math.max(...submissions.map(s => s.score))}
                </div>
                <p className="text-xs text-muted-foreground font-medium">Out of 100</p>
              </div>
            </Card>
            
            <Card className="contest-card text-center hover:scale-105 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-contest-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <BarChart3 className="w-10 h-10 text-contest-accent mr-2" />
                  <span className="text-sm text-muted-foreground font-medium">Average</span>
                </div>
                <div className="score-display text-5xl mb-3 text-contest-accent">
                  {Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length)}
                </div>
                <p className="text-xs text-muted-foreground font-medium">Mean Score</p>
              </div>
            </Card>
            
            <Card className="contest-card text-center hover:scale-105 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-contest-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <Target className="w-10 h-10 text-contest-primary mr-2 animate-pulse" />
                  <span className="text-sm text-muted-foreground font-medium">Top Similarity</span>
                </div>
                <div className="score-display text-5xl mb-3 text-contest-primary">
                  {Math.max(...submissions.map(s => s.similarity || 0))}%
                </div>
                <p className="text-xs text-muted-foreground font-medium">Match Rate</p>
              </div>
            </Card>
            
            <Card className="contest-card text-center hover:scale-105 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-contest-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-10 h-10 text-contest-secondary mr-2" />
                  <span className="text-sm text-muted-foreground font-medium">Participants</span>
                </div>
                <div className="score-display text-5xl mb-3 text-contest-secondary">
                  {submissions.length}
                </div>
                <p className="text-xs text-muted-foreground font-medium">Total Entries</p>
              </div>
            </Card>
          </div>
        )}

        {/* Winner Showcase */}
        {submissions.length > 0 && (
          <Card className="contest-card animate-slide-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-contest-gold/5 via-transparent to-contest-secondary/5"></div>
            <div className="relative text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-8">
                <Crown className="w-12 h-12 text-contest-gold animate-pulse" />
                <h2 className="text-5xl font-bold bg-gradient-to-r from-contest-gold via-contest-secondary to-contest-gold bg-clip-text text-transparent">
                  🏆 NEURONEX CHAMPION 🏆
                </h2>
                <Crown className="w-12 h-12 text-contest-gold animate-pulse" />
              </div>
              
              {submissions[0] && (
                <div className="max-w-5xl mx-auto">
                  <div className="bg-gradient-to-r from-contest-gold/20 via-contest-secondary/10 to-contest-gold/20 rounded-3xl p-10 border-4 border-contest-gold/30 shadow-2xl">
                    <div className="flex items-center justify-center gap-6 mb-8">
                      <Badge className="rank-gold text-xl px-8 py-3 animate-pulse shadow-xl">
                        🏆 WINNER - SCORE: {submissions[0].score}/100
                      </Badge>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold mb-4 text-contest-gold flex items-center justify-center gap-3">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                        Winning Prompt
                        <Star className="w-6 h-6 animate-pulse" />
                      </h3>
                      <p className="text-xl italic bg-contest-gold/10 rounded-2xl p-8 border-2 border-contest-gold/30 leading-relaxed">
                        "{submissions[0].prompt}"
                      </p>
                    </div>
                    
                    {showImages && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                        <div className="text-center">
                          <h4 className="font-semibold mb-4 text-contest-accent text-lg">Reference Image</h4>
                          <img 
                            src={submissions[0].referenceImage || currentTarget.image} 
                            alt="Reference" 
                            className="w-full max-w-80 h-80 object-cover rounded-2xl border-4 border-contest-accent/30 mx-auto shadow-2xl hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="text-center">
                          <h4 className="font-semibold mb-4 text-contest-gold text-lg">Winner's Creation</h4>
                          <img 
                            src={submissions[0].image} 
                            alt="Winner's result" 
                            className="w-full max-w-80 h-80 object-cover rounded-2xl border-4 border-contest-gold/50 mx-auto shadow-2xl hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <p className="text-lg text-contest-gold mb-3 font-semibold">🎉 Congratulations to our Neuronex Champion! 🎉</p>
                      <p className="text-sm text-muted-foreground">
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
        <Card className="contest-card animate-slide-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-contest-primary/5 via-transparent to-contest-accent/5"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-10">
              <Trophy className="w-10 h-10 text-contest-gold animate-pulse" />
              <h2 className="text-4xl font-bold bg-contest-gradient bg-clip-text text-transparent">
                Neuronex Leaderboard
              </h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-contest-primary via-contest-accent to-transparent rounded-full"></div>
              <Medal className="w-8 h-8 text-contest-bronze" />
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-20">
                <Trophy className="w-20 h-20 mx-auto mb-8 text-muted-foreground/50" />
                <h3 className="text-2xl font-semibold mb-4">No Submissions Yet</h3>
                <p className="text-muted-foreground text-lg">The Neuronex Vision Prompt challenge awaits!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {submissions.map((submission, index) => (
                  <Card 
                    key={submission.id} 
                    className={`leaderboard-card hover:scale-[1.02] transition-all duration-300 relative overflow-hidden ${
                      index === 0 ? 'ring-4 ring-contest-gold/50 bg-contest-gold/5 shadow-2xl' :
                      index === 1 ? 'ring-4 ring-contest-silver/50 bg-contest-silver/5 shadow-xl' :
                      index === 2 ? 'ring-4 ring-contest-bronze/50 bg-contest-bronze/5 shadow-lg' : 'shadow-md'
                    }`}
                  >
                    {index < 3 && (
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-contest-gold via-contest-silver to-contest-bronze"></div>
                    )}
                    <div className="flex items-start gap-8 p-2">
                      <div className="flex flex-col items-center gap-4 min-w-32">
                        {getRankIcon(index)}
                        {getRankBadge(index)}
                        <div className="text-center">
                          <div className="score-display text-3xl">{submission.score}</div>
                          <div className="text-xs text-muted-foreground font-medium">/ 100</div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-contest-accent font-semibold bg-contest-accent/10 px-3 py-1 rounded-full">
                              Similarity: {submission.similarity || 0}% match
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                            {new Date(submission.timestamp).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-contest-accent" />
                              Participant's Prompt:
                            </h4>
                            <p className="text-muted-foreground italic bg-muted/30 p-6 rounded-xl border-l-4 border-contest-accent/30 text-lg leading-relaxed">
                              "{submission.prompt}"
                            </p>
                          </div>
                          
                          {showImages && (
                            <div className="grid grid-cols-2 gap-8">
                              <div>
                                <h4 className="font-semibold text-lg mb-4 text-contest-accent">Reference:</h4>
                                <img 
                                  src={submission.referenceImage || currentTarget.image} 
                                  alt="Reference" 
                                  className="w-full h-48 object-cover rounded-xl border-2 border-contest-accent/30 shadow-lg hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg mb-4 text-contest-primary">Generated:</h4>
                                <img 
                                  src={submission.image} 
                                  alt="Generated result" 
                                  className="w-full h-48 object-cover rounded-xl border-2 border-contest-primary/30 shadow-lg hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <BarChart3 className="w-5 h-5 text-contest-secondary" />
                              Neural Analysis:
                            </h4>
                            <p className="text-muted-foreground bg-muted/20 p-6 rounded-xl text-lg leading-relaxed">
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
