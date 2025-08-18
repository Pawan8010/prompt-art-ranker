
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface SubmissionResult {
  image: string;
  score: number;
  feedback: string;
}

const PromptSubmission = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual backend call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: SubmissionResult = {
        image: `https://picsum.photos/512/512?random=${Date.now()}`,
        score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
        feedback: "Great creativity! Your prompt generated a visually appealing and coherent image."
      };
      
      setResult(mockResult);
      toast.success("Your image has been generated!");
      
      // Save to localStorage (simulate backend storage)
      const submissions = JSON.parse(localStorage.getItem('contest-submissions') || '[]');
      submissions.push({
        id: Date.now(),
        prompt,
        ...mockResult,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('contest-submissions', JSON.stringify(submissions));
      
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSubmission = () => {
    setResult(null);
    setPrompt("");
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <Card className="contest-card animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Result</h2>
            <div className="score-display mb-4">{result.score}/100</div>
          </div>
          
          <div className="mb-6">
            <img 
              src={result.image} 
              alt="Generated result" 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Your Prompt:</h3>
            <p className="text-muted-foreground italic">"{prompt}"</p>
          </div>
          
          <div className="bg-contest-primary/10 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2 text-contest-primary">Feedback:</h3>
            <p className="text-sm">{result.feedback}</p>
          </div>
          
          <Button onClick={handleNewSubmission} className="btn-contest w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Submit Another Prompt
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Card className="contest-card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Submit Your Prompt</h2>
          <p className="text-muted-foreground">
            Write a creative prompt to generate an image and get your score
          </p>
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
              placeholder="Describe the image you want to create... Be creative and specific!"
              className="prompt-input min-h-32 resize-none"
              disabled={isLoading}
            />
            <div className="text-xs text-muted-foreground mt-2">
              Tip: More specific and creative prompts tend to score higher!
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
                Generating Image...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate & Score
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PromptSubmission;
