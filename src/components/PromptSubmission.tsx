import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Target, CheckCircle, FileText, ImageIcon } from "lucide-react";
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
  }, []);

  // Update word and character count when prompt changes
  useEffect(() => {
    const words = prompt.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(prompt.length);
  }, [prompt]);

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
      // Simulate API call for image generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate image based on user's prompt (simulate AI generation)
      const userGeneratedImage = `https://picsum.photos/512/512?random=${Date.now()}&seed=${encodeURIComponent(prompt.slice(0, 50))}`;
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
      
      toast.success("Your image has been generated successfully!");
      
      // Save to localStorage with participant info
      const participantData = JSON.parse(localStorage.getItem('participant-data') || '{}');
      const submissions = JSON.parse(localStorage.getItem('contest-submissions') || '[]');
      submissions.push({
        id: Date.now(),
        prompt,
        wordCount,
        charCount,
        participantName: participantData.name || 'Anonymous',
        participantEmail: participantData.email || '',
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
    const participantData = JSON.parse(localStorage.getItem('participant-data') || '{}');
    
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="contest-card animate-fade-in">
          <div className="text-center py-16">
            <CheckCircle className="w-24 h-24 mx-auto mb-8 text-green-500 animate-pulse" />
            <h2 className="text-3xl font-bold mb-4 text-contest-primary">Image Generated Successfully!</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Thank you {participantData.name || 'participant'} for participating!
            </p>
            <p className="text-muted-foreground mb-8">
              Here's the image generated from your prompt:
            </p>
            
            {/* Show the generated image */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="font-semibold mb-4 text-contest-accent">Reference Image</h3>
                  <img 
                    src={currentTarget.image} 
                    alt="Reference image" 
                    className="w-full h-64 object-cover rounded-2xl border-4 border-contest-accent/30 shadow-xl"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-4 text-contest-primary">Your Generated Image</h3>
                  <img 
                    src={generatedImage} 
                    alt="Your generated image" 
                    className="w-full h-64 object-cover rounded-2xl border-4 border-contest-primary/30 shadow-xl"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-contest-primary/10 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-3 text-contest-primary flex items-center justify-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Your Submitted Prompt:
              </h3>
              <p className="text-muted-foreground italic text-lg mb-4">"{prompt}"</p>
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
            
            <p className="text-sm text-muted-foreground mb-8">
              Your submission has been recorded! Scoring and results will be available in the admin panel.
            </p>
            <Button onClick={handleNewSubmission} className="btn-contest">
              <Send className="w-4 h-4 mr-2" />
              Submit Another Prompt
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card className="contest-card shimmer">
        <div className="text-center mb-6">
          <Target className="w-12 h-12 mx-auto mb-4 text-contest-primary animate-float" />
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-contest-primary to-contest-accent bg-clip-text text-transparent">
            Recreate This Image
          </h2>
          <p className="text-muted-foreground">
            Write a detailed prompt that would generate an image similar to the reference below
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
              Reference
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Your goal: Write a detailed prompt that would generate something similar to this image
            </p>
            {currentTarget.prompt !== "A majestic dragon soaring through a cloudy sunset sky, with golden light illuminating its scales" && (
              <p className="text-xs text-contest-accent italic">
                Hint: {currentTarget.prompt}
              </p>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="prompt" className="block text-sm font-medium">
                Your Creative Prompt
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
              placeholder="Describe what you see in the reference image... Be specific and detailed! Include colors, objects, lighting, composition, style, and atmosphere."
              className="prompt-input min-h-32 resize-none"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-2 text-xs">
              <div className="text-muted-foreground">
                Tip: The more accurately you describe the reference image, the better your generated image will match!
              </div>
              {wordCount > 0 && (
                <div className={`font-medium ${wordCount < 5 ? 'text-red-500' : wordCount < 10 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {wordCount < 5 ? 'Need at least 5 words' : 
                   wordCount < 10 ? 'Good, add more details' : 
                   wordCount < 20 ? 'Great detail level!' : 
                   'Excellent detail!'}
                </div>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="btn-contest w-full"
            disabled={isLoading || !prompt.trim() || wordCount < 5}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Image...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate Image ({wordCount} words)
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PromptSubmission;
