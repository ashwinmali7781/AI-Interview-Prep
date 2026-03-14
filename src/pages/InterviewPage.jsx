import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Bot, User, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const interviewQuestions = {
  Arrays: [
    "Explain how you would find the maximum subarray sum in an array. What algorithm would you use?",
    "How would you merge two sorted arrays into one sorted array? Walk me through your approach.",
    "Describe how you'd implement a function to rotate an array by k positions.",
    "What's the most efficient way to find duplicates in an array? Discuss time/space tradeoffs.",
  ],
  Trees: [
    "Explain the difference between BFS and DFS for tree traversal. When would you use each?",
    "How would you check if a binary tree is balanced? What's the time complexity?",
    "Describe how to find the lowest common ancestor of two nodes in a BST.",
    "How would you serialize and deserialize a binary tree?",
  ],
  Graphs: [
    "How would you detect a cycle in a directed graph? Explain your approach.",
    "Describe Dijkstra's algorithm. What are its limitations?",
    "How would you find the shortest path in an unweighted graph?",
    "Explain topological sorting and when it's useful.",
  ],
  "Dynamic Programming": [
    "Explain the concept of overlapping subproblems. Give an example.",
    "How would you solve the knapsack problem? Walk me through your DP approach.",
    "Describe the difference between top-down and bottom-up DP.",
    "How would you find the longest common subsequence of two strings?",
  ],
};

const evaluateAnswer = (answer) => {
  const words = answer.trim().split(/\s+/).length;
  if (words < 10) return { score: 30, feedback: "Your answer is too brief. Try to explain your approach in more detail, including algorithm choice, time complexity, and edge cases." };
  if (words < 30) return { score: 55, feedback: "Decent start! Consider mentioning time/space complexity, potential edge cases, and alternative approaches for a stronger answer." };
  if (words < 60) return { score: 75, feedback: "Good answer! You showed solid understanding. To improve further, discuss trade-offs between different approaches and mention specific data structures." };
  return { score: 90, feedback: "Excellent answer! You provided a thorough explanation with good technical depth. Strong interview performance." };
};

const InterviewPage = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState("Arrays");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = () => {
    const questions = interviewQuestions[category];
    setMessages([{ role: "ai", content: `Welcome to your ${category} mock interview! I'll ask you ${questions.length} technical questions. Let's begin.\n\n**Question 1:** ${questions[0]}` }]);
    setQuestionIndex(0);
    setScores([]);
    setIsStarted(true);
    setIsFinished(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isFinished) return;
    const questions = interviewQuestions[category];
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const { score, feedback } = evaluateAnswer(input);
    const newScores = [...scores, score];
    setScores(newScores);

    const nextIndex = questionIndex + 1;
    let aiResponse;

    if (nextIndex >= questions.length) {
      const avgScore = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
      aiResponse = `**Feedback:** ${feedback} (Score: ${score}/100)\n\n---\n\n🎉 **Interview Complete!**\n\nYour overall score: **${avgScore}/100**\n\n${avgScore >= 80 ? "Outstanding performance! You're well-prepared." : avgScore >= 60 ? "Good effort! Keep practicing to improve." : "Keep studying and practicing. You'll get better!"}`;
      setIsFinished(true);

      if (user) {
        await supabase.from("interview_sessions").insert({
          user_id: user.id,
          score: avgScore,
          total_questions: questions.length,
          feedback: `${category} interview - ${avgScore}% overall`,
        });
      }
    } else {
      aiResponse = `**Feedback:** ${feedback} (Score: ${score}/100)\n\n**Question ${nextIndex + 1}:** ${questions[nextIndex]}`;
      setQuestionIndex(nextIndex);
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
    }, 800);
  };

  if (!isStarted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Mock Interview</h1>
          <p className="text-muted-foreground">Practice with simulated technical interview questions</p>
        </div>
        <Card className="shadow-card">
          <CardContent className="space-y-6 pt-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary">
              <MessageSquare className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-card-foreground">Ready to practice?</h2>
              <p className="text-muted-foreground">Select a topic and start your mock interview</p>
            </div>
            <div className="space-y-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arrays">Arrays</SelectItem>
                  <SelectItem value="Trees">Trees</SelectItem>
                  <SelectItem value="Graphs">Graphs</SelectItem>
                  <SelectItem value="Dynamic Programming">Dynamic Programming</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={startInterview} className="w-full gradient-primary text-primary-foreground" size="lg">
                Start Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mock Interview</h1>
          <Badge variant="outline">{category}</Badge>
        </div>
        <Button variant="outline" onClick={startInterview} size="sm">
          <RotateCcw className="mr-1 h-4 w-4" /> Restart
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="max-h-[50vh] space-y-4 overflow-y-auto pr-2">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === "ai" ? "gradient-primary" : "bg-secondary"}`}>
                  {msg.role === "ai" ? <Bot className="h-4 w-4 text-primary-foreground" /> : <User className="h-4 w-4 text-secondary-foreground" />}
                </div>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.role === "ai" ? "bg-muted text-card-foreground" : "gradient-primary text-primary-foreground"}`}>
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {!isFinished && (
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <Button onClick={handleSend} className="gradient-primary text-primary-foreground self-end" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isFinished && (
        <div className="text-center">
          <Button onClick={startInterview} className="gradient-primary text-primary-foreground">
            Start New Interview
          </Button>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
