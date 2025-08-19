
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Target, CheckCircle } from "lucide-react";
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
    // Update target when component mounts or when localStorage changes
    setCurrentTarget(getCurrentTarget());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call for image generation and similarity scoring
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Calculate similarity score based on prompt matching (simplified)
      const similarity = calculateSimilarity(prompt, currentTarget.prompt);
      const baseScore = Math.floor(Math.random() * 30) + 50; // Base score 50-80
      const finalScore = Math.min(100, baseScore + similarity);
      
      const mockResult: SubmissionResult = {
        image: `https://picsum.photos/512/512?random=${Date.now()}`,
        score: finalScore,
        similarity: similarity,
        feedback: generateFeedback(similarity, finalScore)
      };
      
      toast.success("Your submission has been recorded successfully!");
      
      // Save to localStorage
      const submissions = JSON.parse(localStorage.getItem('contest-submissions') || '[]');
      submissions.push({
        id: Date.now(),
        prompt,
        referenceImage: currentTarget.image,
        ...mockResult,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('contest-submissions', JSON.stringify(submissions));
      
      setIsSubmitted(true);
      
    } catch (error) {
      toast.error("Failed to process submission. Please try again.");
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
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="contest-card animate-fade-in">
          <div className="text-center py-16">
            <CheckCircle className="w-24 h-24 mx-auto mb-8 text-green-500 animate-pulse" />
            <h2 className="text-3xl font-bold mb-4 text-contest-primary">Submission Successful!</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for participating! Your prompt has been submitted and is being evaluated.
            </p>
            <div className="bg-contest-primary/10 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-3 text-contest-primary">Your Submitted Prompt:</h3>
              <p className="text-muted-foreground italic text-lg">"{prompt}"</p>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              Results will be available in the admin panel. Check back later to see how you ranked!
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
      <Card className="contest-card">
        <div className="text-center mb-6">
          <Target className="w-12 h-12 mx-auto mb-4 text-contest-primary" />
          <h2 className="text-2xl font-bold mb-2">Recreate This Image</h2>
          <p className="text-muted-foreground">
            Write a prompt that would generate an image similar to the reference below
          </p>
        </div>

        {/* Reference Image Display */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <img 
              src={currentTarget.image} 
              alt="Reference image to recreate" 
              className="w-full rounded-lg shadow-xl border-4 border-contest-primary/20"
            />
            <div className="absolute -top-2 -right-2 bg-contest-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
              Reference
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Your goal: Write a prompt that would generate something similar to this image
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
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Your Creative Prompt
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you see in the reference image... Be specific and detailed!"
              className="prompt-input min-h-32 resize-none"
              disabled={isLoading}
            />
            <div className="text-xs text-muted-foreground mt-2">
              Tip: The more accurately you describe the reference image, the higher your score!
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="btn-contest w-full"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Submission...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Prompt
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PromptSubmission;
