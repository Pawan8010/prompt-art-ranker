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
    // Get participant data and ensure it's properly loaded
    const userData = JSON.parse(localStorage.getItem('participant-data') || '{}');
    if (userData && userData.name) {
      setParticipantData(userData);
    }
  }, []);

  // Update word and character count when prompt changes
  useEffect(() => {
    const words = prompt.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(prompt.length);
  }, [prompt]);

  // Enhanced image generation with much better accuracy
  const generateRelevantImage = (userPrompt: string) => {
    const keywords = userPrompt.toLowerCase();
    
    // Enhanced keyword categories with more specific matching
    const imageCategories = {
      dragon: {
        patterns: ['dragon', 'drake', 'wyvern', 'fire breathing', 'scales', 'wings', 'mythical beast'],
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=512&h=512&fit=crop'
        ]
      },
      sunset: {
        patterns: ['sunset', 'sunrise', 'golden hour', 'orange sky', 'dusk', 'twilight', 'evening'],
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=512&h=512&fit=crop'
        ]
      },
      sky: {
        patterns: ['sky', 'clouds', 'cloudscape', 'heavens', 'atmosphere', 'air'],
        images: [
          'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop'
        ]
      },
      nature: {
        patterns: ['forest', 'tree', 'mountain', 'lake', 'river', 'landscape', 'natural', 'wilderness'],
        images: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=512&h=512&fit=crop'
        ]
      },
      fantasy: {
        patterns: ['magic', 'magical', 'mystical', 'enchanted', 'fairy', 'wizard', 'castle', 'unicorn'],
        images: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=512&h=512&fit=crop'
        ]
      },
      urban: {
        patterns: ['city', 'building', 'urban', 'street', 'architecture', 'skyscraper', 'metropolitan'],
        images: [
          'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=512&h=512&fit=crop'
        ]
      },
      portrait: {
        patterns: ['person', 'face', 'human', 'portrait', 'woman', 'man', 'people'],
        images: [
          'https://images.unsplash.com/photo-1494790108755-2616c96c2ec0?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=512&h=512&fit=crop'
        ]
      }
    };

    // Find the best matching category
    let bestMatch = null;
    let maxScore = 0;

    for (const [category, data] of Object.entries(imageCategories)) {
      let score = 0;
      for (const pattern of data.patterns) {
        if (keywords.includes(pattern)) {
          score += pattern.length; // Longer matches get higher scores
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = category;
      }
    }

    // If we found a good match, use a relevant image
    if (bestMatch && maxScore > 0) {
      const categoryData = imageCategories[bestMatch as keyof typeof imageCategories];
      const randomIndex = Math.floor(Math.random() * categoryData.images.length);
      return categoryData.images[randomIndex];
    }

    // Fallback to a generic but high-quality image
    const fallbackImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=512&h=512&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=512&h=512&fit=crop'
    ];
    
    const seed = userPrompt.length + userPrompt.charCodeAt(0);
    return fallbackImages[seed % fallbackImages.length];
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
      
      // Generate much more relevant image based on user's prompt
      const userGeneratedImage = generateRelevantImage(prompt);
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
                <div className="text-center relative">
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
      {/* Enhanced User Welcome Section */}
      {participantData && participantData.name && (
        <Card className="contest-card mb-6 animate-slide-in">
          <div className="flex items-center gap-4 p-6">
            <div className="relative">
              <User className="w-12 h-12 text-contest-primary" />
              <Crown className="w-6 h-6 text-contest-gold absolute -top-2 -right-2 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-contest-primary mb-1">
                Welcome back, {participantData.name}! 🎨
              </h3>
              <p className="text-muted-foreground text-lg">
                Ready to create your next masterpiece? Let your creativity flow!
              </p>
              <p className="text-sm text-contest-accent mt-1">
                Participant #{participantData.participantId || 'N/A'} • {participantData.email}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-contest-primary/20 rounded-full px-4 py-2">
                <p className="text-sm font-semibold text-contest-primary">Active Artist</p>
              </div>
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
