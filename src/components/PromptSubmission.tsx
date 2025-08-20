
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Target, CheckCircle, FileText, ImageIcon, User, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface SubmissionResult {
  image: string;
  score: number;
  feedback: string;
  similarity: number;
}

const PromptSubmission = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [generatedImage, setGeneratedImage] = useState("");
  const [participantData, setParticipantData] = useState<any>(null);

  // Get current target from localStorage
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
    setCurrentTarget(getCurrentTarget());
    // Get participant data
    const userData = JSON.parse(localStorage.getItem('participant-data') || '{}');
    setParticipantData(userData);
  }, []);

  // Update word and character count when prompt changes
  useEffect(() => {
    const words = prompt.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(prompt.length);
  }, [prompt]);

  // Improved image generation based on prompt keywords
  const generateImageFromPrompt = (userPrompt: string) => {
    const keywords = userPrompt.toLowerCase().split(/\s+/);
    
    // Enhanced seed generation based on prompt content
    let seed = 0;
    for (let i = 0; i < userPrompt.length; i++) {
      seed += userPrompt.charCodeAt(i) * (i + 1);
    }
    
    // Different image categories based on keywords
    const categories = {
      nature: ['tree', 'forest', 'mountain', 'lake', 'flower', 'sunset', 'sky', 'cloud'],
      fantasy: ['dragon', 'magic', 'wizard', 'castle', 'fairy', 'unicorn', 'mystical'],
      urban: ['city', 'building', 'street', 'car', 'urban', 'modern', 'architecture'],
      portrait: ['person', 'face', 'portrait', 'human', 'woman', 'man', 'child'],
      abstract: ['abstract', 'colorful', 'pattern', 'geometric', 'artistic']
    };
    
    let categoryMatch = 'random';
    let maxMatches = 0;
    
    for (const [category, categoryKeywords] of Object.entries(categories)) {
      const matches = keywords.filter(word => categoryKeywords.includes(word)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        categoryMatch = category;
      }
    }
    
    // Generate more relevant image based on category and prompt
    const baseUrls = {
      nature: `https://picsum.photos/512/512?random=${seed % 1000}&nature`,
      fantasy: `https://picsum.photos/512/512?random=${seed % 1000}&fantasy`,
      urban: `https://picsum.photos/512/512?random=${seed % 1000}&urban`,
      portrait: `https://picsum.photos/512/512?random=${seed % 1000}&portrait`,
      abstract: `https://picsum.photos/512/512?random=${seed % 1000}&abstract`,
      random: `https://picsum.photos/512/512?random=${seed % 1000}`
    };
    
    return baseUrls[categoryMatch as keyof typeof baseUrls] || baseUrls.random;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (wordCount < 5) {
      toast.error("Please write a more detailed prompt (minimum 5 words)");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate AI image generation with progress updates
      toast.info("🎨 Analyzing your prompt...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.info("🖼️ Generating your image...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate improved image based on user's prompt
      const userGeneratedImage = generateImageFromPrompt(prompt);
      setGeneratedImage(userGeneratedImage);
      
      // Calculate similarity score based on prompt matching (for admin use only)
      const similarity = calculateSimilarity(prompt, currentTarget.prompt);
      const baseScore = Math.floor(Math.random() * 30) + 50; // Base score 50-80
      const finalScore = Math.min(100, baseScore + similarity);
      
      const mockResult: SubmissionResult = {
        image: userGeneratedImage,
        score: finalScore,
        similarity: similarity,
        feedback: generateFeedback(similarity, finalScore)
      };
      
      toast.success("🎉 Your masterpiece has been created!");
      
      // Save to localStorage with participant info
      const submissions = JSON.parse(localStorage.getItem('contest-submissions') || '[]');
      submissions.push({
        id: Date.now(),
        prompt,
        wordCount,
        charCount,
        participantName: participantData?.name || 'Anonymous',
        participantEmail: participantData?.email || '',
        participantId: participantData?.participantId || Date.now(),
        referenceImage: currentTarget.image,
        ...mockResult,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('contest-submissions', JSON.stringify(submissions));
      
      setIsSubmitted(true);
      
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSimilarity = (userPrompt: string, refPrompt: string): number => {
    const userWords = userPrompt.toLowerCase().split(' ');
    const refWords = refPrompt.toLowerCase().split(' ');
    const commonWords = userWords.filter(word => refWords.includes(word));
    return Math.round((commonWords.length / refWords.length) * 30); // Max 30 bonus points
  };

  const generateFeedback = (similarity: number, score: number): string => {
    if (score >= 90) return "Excellent! Your prompt captures the essence of the reference image beautifully.";
    if (score >= 75) return "Great work! Your prompt shows good understanding of the reference image.";
    if (score >= 60) return "Good attempt! Try to include more specific details from the reference image.";
    return "Keep trying! Focus on the key elements visible in the reference image.";
  };

  const handleNewSubmission = () => {
    setIsSubmitted(false);
    setPrompt("");
    setGeneratedImage("");
  };

  const getWordCountColor = () => {
    if (wordCount < 5) return "text-red-500";
    if (wordCount < 10) return "text-yellow-500";
    if (wordCount < 20) return "text-green-500";
    return "text-contest-primary";
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="contest-card animate-fade-in">
          <div className="text-center py-16">
            <CheckCircle className="w-24 h-24 mx-auto mb-8 text-green-500 animate-pulse" />
            <h2 className="text-3xl font-bold mb-4 text-contest-primary">🎨 Masterpiece Created! 🎨</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Outstanding work, <span className="text-contest-primary font-semibold">{participantData?.name || 'Artist'}</span>! 
            </p>
            <p className="text-muted-foreground mb-8">
              Your creative vision has been transformed into this beautiful image:
            </p>
            
            {/* Show the generated image with better presentation */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="font-semibold mb-4 text-contest-accent flex items-center justify-center gap-2">
                    <Target className="w-5 h-5" />
                    Reference Challenge
                  </h3>
                  <img 
                    src={currentTarget.image} 
                    alt="Reference image" 
                    className="w-full h-64 object-cover rounded-2xl border-4 border-contest-accent/30 shadow-xl hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-4 text-contest-primary flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Your Creation
                  </h3>
                  <img 
                    src={generatedImage} 
                    alt="Your generated masterpiece" 
                    className="w-full h-64 object-cover rounded-2xl border-4 border-contest-primary/30 shadow-xl hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -top-2 -right-2 bg-contest-gold text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse shadow-xl">
                    ✨ NEW
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-contest-primary/10 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-3 text-contest-primary flex items-center justify-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Your Artistic Prompt:
              </h3>
              <p className="text-muted-foreground italic text-lg mb-4 bg-white/50 rounded-xl p-4 border-l-4 border-contest-primary">
                "{prompt}"
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-contest-accent" />
                  <span>Words: <span className="font-semibold text-contest-primary">{wordCount}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Characters: <span className="font-semibold text-contest-primary">{charCount}</span></span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-contest-gold/20 to-contest-secondary/20 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-2">
                🏆 Your submission has been recorded for the leaderboard!
              </p>
              <p className="text-xs text-muted-foreground">
                Scoring and final results will be available in the admin panel.
              </p>
            </div>
            
            <Button onClick={handleNewSubmission} className="btn-contest text-lg px-8 py-4">
              <Send className="w-5 h-5 mr-2" />
              Create Another Masterpiece
              <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* User Welcome Section */}
      {participantData && (
        <Card className="contest-card mb-6 animate-slide-in">
          <div className="flex items-center gap-4 p-4">
            <div className="relative">
              <User className="w-12 h-12 text-contest-primary" />
              <Crown className="w-6 h-6 text-contest-gold absolute -top-2 -right-2 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-contest-primary">
                Welcome back, {participantData.name}! 🎨
              </h3>
              <p className="text-muted-foreground">
                Ready to create your next masterpiece? Let your creativity flow!
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Participant #{participantData.participantId || 'N/A'}</p>
              <p>{participantData.email}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="contest-card shimmer">
        <div className="text-center mb-6">
          <Target className="w-12 h-12 mx-auto mb-4 text-contest-primary animate-float" />
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-contest-primary to-contest-accent bg-clip-text text-transparent">
            🎯 Recreate This Masterpiece
          </h2>
          <p className="text-muted-foreground">
            Craft a detailed prompt that would generate an image similar to the reference below
          </p>
        </div>

        {/* Reference Image Display */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <img 
              src={currentTarget.image} 
              alt="Reference image to recreate" 
              className="w-full rounded-lg shadow-xl border-4 border-contest-primary/20 hover-lift"
            />
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-contest-primary to-contest-accent text-white px-3 py-1 rounded-full text-sm font-semibold shimmer">
              🎯 TARGET
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Your mission: Write a detailed prompt that would generate something similar to this image
            </p>
            {currentTarget.prompt !== "A majestic dragon soaring through a cloudy sunset sky, with golden light illuminating its scales" && (
              <p className="text-xs text-contest-accent italic">
                💡 Hint: {currentTarget.prompt}
              </p>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="prompt" className="block text-sm font-medium">
                🎨 Your Creative Prompt
              </label>
              <div className="flex items-center gap-4 text-xs">
                <div className={`flex items-center gap-1 ${getWordCountColor()}`}>
                  <FileText className="w-3 h-3" />
                  <span className="font-semibold">{wordCount}</span>
                  <span>words</span>
                </div>
                <div className="text-muted-foreground">
                  <span className="font-semibold">{charCount}</span>
                  <span> characters</span>
                </div>
              </div>
            </div>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you see in the reference image... Be specific and detailed! Include colors, objects, lighting, composition, style, and atmosphere. The more accurate your description, the better your generated image will match!"
              className="prompt-input min-h-32 resize-none"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-2 text-xs">
              <div className="text-muted-foreground">
                💡 Pro tip: The more accurately you describe the reference image, the better your AI-generated result will be!
              </div>
              {wordCount > 0 && (
                <div className={`font-medium ${wordCount < 5 ? 'text-red-500' : wordCount < 10 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {wordCount < 5 ? '❌ Need at least 5 words' : 
                   wordCount < 10 ? '⚠️ Good, add more details' : 
                   wordCount < 20 ? '✅ Great detail level!' : 
                   '🎯 Excellent detail!'}
                </div>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="btn-contest w-full text-lg py-4"
            disabled={isLoading || !prompt.trim() || wordCount < 5}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                🎨 Creating Your Masterpiece...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                🚀 Generate My Image ({wordCount} words)
                <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PromptSubmission;
