import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark, BookmarkCheck, Search, Eye, EyeOff, Play, Clock, Copy, Check, Sparkles, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";

const difficultyColors = {
  Easy:   "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard:   "bg-destructive/10 text-destructive border-destructive/20",
};

const COMPANIES = ["All Companies", "Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix"];

/* ── AI Code Review via Anthropic API ── */
async function getAIReview(code, title) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Review this JavaScript solution for "${title}". Give feedback on: 1) Correctness, 2) Time & Space complexity, 3) Code quality, 4) One specific improvement tip. Be concise (150 words max).\n\nCode:\n${code}`,
        }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "Could not get AI review.";
  } catch {
    return "AI review unavailable — check your API key.";
  }
}

const PracticePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions]             = useState([]);
  const [bookmarks, setBookmarks]             = useState(new Set());
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [code, setCode]                       = useState("");
  const [showSolution, setShowSolution]       = useState(false);
  const [search, setSearch]                   = useState("");
  const [diffFilter, setDiffFilter]           = useState("all");
  const [catFilter, setCatFilter]             = useState("all");
  const [companyFilter, setCompanyFilter]     = useState("All Companies");
  const [submitting, setSubmitting]           = useState(false);
  const [reviewing, setReviewing]             = useState(false);
  const [aiReview, setAiReview]               = useState("");
  const [startTime, setStartTime]             = useState(0);
  const [elapsed, setElapsed]                 = useState(0);
  const [copied, setCopied]                   = useState(false);
  const timerRef = useRef(null);

  /* load questions + bookmarks */
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("questions").select("*").order("difficulty");
      setQuestions(data || []);
      if (user) {
        const { data: bm } = await supabase.from("bookmarks").select("question_id");
        setBookmarks(new Set((bm || []).map((b) => b.question_id)));
      }
    };
    load();
  }, [user]);

  /* live timer */
  useEffect(() => {
    if (selectedQuestion) {
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [selectedQuestion, startTime]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const filtered = questions.filter((q) => {
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (diffFilter !== "all" && q.difficulty !== diffFilter) return false;
    if (catFilter !== "all" && q.category !== catFilter) return false;
    return true;
  });

  const selectQuestion = (q) => {
    setSelectedQuestion(q);
    setCode(q.starter_code || "");
    setShowSolution(false);
    setAiReview("");
    const now = Date.now();
    setStartTime(now);
    setElapsed(0);
  };

  const toggleBookmark = async (questionId) => {
    if (!user) return;
    if (bookmarks.has(questionId)) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("question_id", questionId);
      setBookmarks((prev) => { const n = new Set(prev); n.delete(questionId); return n; });
      toast({ title: "Bookmark removed" });
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, question_id: questionId });
      setBookmarks((prev) => new Set(prev).add(questionId));
      toast({ title: "Bookmarked!" });
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedQuestion) return;
    setSubmitting(true);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    await supabase.from("practice_history").insert({
      user_id: user.id,
      question_id: selectedQuestion.id,
      user_answer: code,
      is_correct: code.trim().length > 20,
      time_spent_seconds: timeSpent,
    });
    toast({ title: "Solution submitted!", description: "Getting AI review..." });
    setShowSolution(true);
    setSubmitting(false);
    // auto trigger AI review
    handleAIReview();
  };

  const handleAIReview = async () => {
    if (!code.trim() || reviewing) return;
    setReviewing(true);
    setAiReview("");
    const review = await getAIReview(code, selectedQuestion.title);
    setAiReview(review);
    setReviewing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Problem detail view ── */
  if (selectedQuestion) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedQuestion(null)} className="gap-2 text-sm">
            ← Back to problems
          </Button>
          <div className="flex items-center gap-3">
            {/* Live timer */}
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-sm font-medium text-foreground">{fmt(elapsed)}</span>
            </div>
            <Badge className={difficultyColors[selectedQuestion.difficulty]}>{selectedQuestion.difficulty}</Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Problem description */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                {selectedQuestion.title}
                <Badge variant="outline" className="text-xs">{selectedQuestion.category}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{selectedQuestion.description}</p>

              {/* AI Review panel */}
              {(reviewing || aiReview) && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold text-primary">AI Code Review</h4>
                  </div>
                  {reviewing ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Analysing your code...
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-foreground/80">{aiReview}</p>
                  )}
                </div>
              )}

              {/* Solution explanation */}
              {showSolution && selectedQuestion.solution && (
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-accent">Solution Explanation</h4>
                  <p className="text-sm text-muted-foreground">{selectedQuestion.solution}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Code editor */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Code Editor
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 gap-1.5 text-xs">
                    {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowSolution(!showSolution)} className="h-7 gap-1.5 text-xs">
                    {showSolution ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showSolution ? "Hide" : "Solution"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-hidden rounded-lg border border-border">
                <Editor
                  height="300px"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  theme="vs-dark"
                  options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "JetBrains Mono" }}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={submitting} className="flex-1 gradient-primary text-primary-foreground font-semibold">
                  {submitting ? "Submitting..." : "Submit Solution"}
                </Button>
                <Button onClick={handleAIReview} disabled={reviewing} variant="outline" className="gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  {reviewing ? "Reviewing..." : "AI Review"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* ── Problem list ── */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Practice Problems</h1>
        <p className="text-sm text-muted-foreground">Solve coding problems by category, difficulty, and company</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search problems..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={diffFilter} onValueChange={setDiffFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Arrays">Arrays</SelectItem>
            <SelectItem value="Trees">Trees</SelectItem>
            <SelectItem value="Graphs">Graphs</SelectItem>
            <SelectItem value="Dynamic Programming">Dynamic Programming</SelectItem>
          </SelectContent>
        </Select>
        {/* Company filter */}
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-[160px]">
            <Building2 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COMPANIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Company filter chips */}
      {companyFilter !== "All Companies" && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtering for:</span>
          <Badge variant="secondary" className="gap-1.5 pr-1.5">
            <Building2 className="h-3 w-3" /> {companyFilter}
            <button onClick={() => setCompanyFilter("All Companies")} className="ml-1 rounded-full hover:text-destructive">×</button>
          </Badge>
        </div>
      )}

      {/* Problem grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card
              className="group cursor-pointer shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
              onClick={() => selectQuestion(q)}
            >
              <CardContent className="pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <Badge className={`${difficultyColors[q.difficulty]} text-xs`}>{q.difficulty}</Badge>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(q.id); }}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {bookmarks.has(q.id)
                      ? <BookmarkCheck className="h-4 w-4 text-primary" />
                      : <Bookmark className="h-4 w-4" />}
                  </button>
                </div>
                <h3 className="mb-1 font-semibold text-card-foreground group-hover:text-primary transition-colors">{q.title}</h3>
                <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{q.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{q.category}</Badge>
                  <Play className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No problems match your filters.</p>
          <button onClick={() => { setSearch(""); setDiffFilter("all"); setCatFilter("all"); setCompanyFilter("All Companies"); }}
            className="mt-2 text-sm text-primary hover:underline">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
