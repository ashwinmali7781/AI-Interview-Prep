import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp, Code } from "lucide-react";
import { motion } from "framer-motion";

const rankStyles = [
  { bg: "from-yellow-400/20 to-yellow-300/10", border: "border-yellow-400/40", text: "text-yellow-500", icon: Trophy },
  { bg: "from-slate-400/20 to-slate-300/10",  border: "border-slate-400/40",  text: "text-slate-400",  icon: Medal },
  { bg: "from-orange-400/20 to-orange-300/10",border: "border-orange-400/40", text: "text-orange-500", icon: Award },
];

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [solvedBoard, setSolvedBoard] = useState([]);
  const [scoreBoard, setScoreBoard] = useState([]);
  const [tab, setTab] = useState("solved");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Top by problems solved
      const { data: hist } = await supabase
        .from("practice_history")
        .select("user_id, is_correct, profiles(display_name)")
        .eq("is_correct", true);

      // Top by interview score
      const { data: sess } = await supabase
        .from("interview_sessions")
        .select("user_id, score, total_questions, profiles(display_name)");

      // Aggregate solved
      const solvedMap = {};
      (hist || []).forEach(({ user_id, profiles }) => {
        if (!solvedMap[user_id]) solvedMap[user_id] = { user_id, name: profiles?.display_name || "Anonymous", count: 0 };
        solvedMap[user_id].count++;
      });
      const solved = Object.values(solvedMap).sort((a, b) => b.count - a.count).slice(0, 10);
      setSolvedBoard(solved);

      // Aggregate avg interview score
      const scoreMap = {};
      (sess || []).forEach(({ user_id, score, total_questions, profiles }) => {
        if (!scoreMap[user_id]) scoreMap[user_id] = { user_id, name: profiles?.display_name || "Anonymous", total: 0, count: 0 };
        scoreMap[user_id].total += (score || 0) / (total_questions || 1) * 100;
        scoreMap[user_id].count++;
      });
      const scores = Object.values(scoreMap)
        .map((e) => ({ ...e, avg: Math.round(e.total / e.count) }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 10);
      setScoreBoard(scores);

      setLoading(false);
    };
    load();
  }, []);

  const board = tab === "solved" ? solvedBoard : scoreBoard;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top performers this week</p>
        </div>
      </div>

      {/* Tab switch */}
      <div className="flex gap-2 rounded-xl border border-border bg-muted/40 p-1">
        <button
          onClick={() => setTab("solved")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
            tab === "solved" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code className="h-4 w-4" /> Problems Solved
        </button>
        <button
          onClick={() => setTab("score")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
            tab === "score" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="h-4 w-4" /> Avg Interview Score
        </button>
      </div>

      {/* Top 3 podium */}
      {board.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[board[1], board[0], board[2]].map((entry, podiumIdx) => {
            const rank = podiumIdx === 1 ? 0 : podiumIdx === 0 ? 1 : 2;
            const style = rankStyles[rank];
            const Icon = style.icon;
            const isMe = entry.user_id === user?.id;
            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rank * 0.1 }}
                className={`relative flex flex-col items-center rounded-xl border bg-gradient-to-b ${style.bg} ${style.border} p-4 ${podiumIdx === 1 ? "scale-105" : ""}`}
              >
                <Icon className={`mb-2 h-6 w-6 ${style.text}`} />
                <Avatar className="mb-2 h-10 w-10 ring-2 ring-border">
                  <AvatarFallback className="gradient-primary text-xs font-bold text-white">
                    {(entry.name || "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className={`text-center text-sm font-semibold ${isMe ? "text-primary" : "text-foreground"}`}>
                  {isMe ? "You" : entry.name}
                </p>
                <p className={`text-lg font-bold ${style.text}`}>
                  {tab === "solved" ? entry.count : `${entry.avg}%`}
                </p>
                <p className="text-xs text-muted-foreground">#{rank + 1}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            {tab === "solved" ? "Most Problems Solved" : "Highest Interview Scores"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {board.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No data yet — be the first on the board!</p>
          ) : (
            <div className="space-y-2">
              {board.map((entry, i) => {
                const isMe = entry.user_id === user?.id;
                const style = rankStyles[i] || {};
                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                      isMe ? "border-primary/30 bg-primary/5" : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <span className={`w-6 text-center text-sm font-bold ${style.text || "text-muted-foreground"}`}>
                      {i + 1}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="gradient-primary text-xs font-bold text-white">
                        {(entry.name || "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`flex-1 text-sm font-medium ${isMe ? "text-primary" : "text-foreground"}`}>
                      {isMe ? `${entry.name} (You)` : entry.name}
                    </span>
                    <Badge variant={isMe ? "default" : "secondary"} className="font-mono text-xs">
                      {tab === "solved" ? `${entry.count} solved` : `${entry.avg}% avg`}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
