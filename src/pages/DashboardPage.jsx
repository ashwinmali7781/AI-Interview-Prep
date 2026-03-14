import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, Clock, TrendingUp, Flame, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

/* ── Streak helpers ── */
function calcStreak(history) {
  if (!history.length) return 0;
  const days = [...new Set(history.map((h) => new Date(h.created_at).toDateString()))];
  days.sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const day of days) {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((cursor - d) / 86400000);
    if (diff <= 1) { streak++; cursor = d; }
    else break;
  }
  return streak;
}

const CATEGORY_COLORS = { Arrays: "#6366f1", Trees: "#8b5cf6", Graphs: "#ec4899", "Dynamic Programming": "#f59e0b" };

const DashboardPage = () => {
  const { user } = useAuth();
  const [history, setHistory]   = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [h, s] = await Promise.all([
        supabase.from("practice_history").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("interview_sessions").select("*").order("created_at", { ascending: false }).limit(10),
      ]);
      setHistory(h.data || []);
      setSessions(s.data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const totalSolved  = history.length;
  const correctCount = history.filter((h) => h.is_correct).length;
  const accuracy     = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 0;
  const avgScore     = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length)
    : 0;
  const streak = calcStreak(history);

  /* category breakdown for bar chart */
  const catData = Object.entries(
    history.reduce((acc, h) => {
      const cat = h.category || "Other";
      if (!acc[cat]) acc[cat] = { solved: 0, total: 0 };
      acc[cat].total++;
      if (h.is_correct) acc[cat].solved++;
      return acc;
    }, {})
  ).map(([name, v]) => ({ name: name.replace("Dynamic Programming", "DP"), solved: v.solved, total: v.total }));

  const stats = [
    { icon: CheckCircle, label: "Problems Solved", value: totalSolved,  color: "text-accent",   bg: "bg-accent/10" },
    { icon: Target,      label: "Accuracy",         value: `${accuracy}%`, color: "text-primary", bg: "bg-primary/10" },
    { icon: Clock,       label: "Interviews",        value: sessions.length, color: "text-warning", bg: "bg-warning/10" },
    { icon: TrendingUp,  label: "Avg Score",         value: `${avgScore}%`, color: "text-success", bg: "bg-success/10" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Welcome back 👋</p>
          <h1 className="text-2xl font-bold text-foreground">{user?.email?.split("@")[0]}'s Dashboard</h1>
        </div>
        {/* Streak badge */}
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${streak > 0 ? "border-orange-400/30 bg-orange-400/10" : "border-border bg-muted/40"}`}>
          <Flame className={`h-5 w-5 ${streak > 0 ? "text-orange-400" : "text-muted-foreground"}`} />
          <div>
            <p className={`text-lg font-bold leading-none ${streak > 0 ? "text-orange-400" : "text-muted-foreground"}`}>{streak}</p>
            <p className="text-xs text-muted-foreground">day streak</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="shadow-card">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Difficulty progress bars */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Zap className="h-4 w-4 text-primary" /> Progress by Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Easy",   color: "bg-success",      solved: history.filter(h => h.difficulty === "Easy"   && h.is_correct).length, total: 10 },
            { label: "Medium", color: "bg-warning",      solved: history.filter(h => h.difficulty === "Medium" && h.is_correct).length, total: 10 },
            { label: "Hard",   color: "bg-destructive",  solved: history.filter(h => h.difficulty === "Hard"   && h.is_correct).length, total: 10 },
          ].map((d) => (
            <div key={d.label} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-card-foreground">{d.label}</span>
                <span className="text-muted-foreground">{d.solved}/{d.total}</span>
              </div>
              <Progress value={(d.solved / d.total) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Category bar chart */}
      {catData.length > 0 && (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Performance by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={catData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="solved" radius={[4,4,0,0]}>
                  {catData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Recent Practice</CardTitle></CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">No practice history yet.</p>
                <p className="mt-1 text-xs text-muted-foreground">Start solving problems!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 5).map((h) => (
                  <div key={h.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Badge variant={h.is_correct ? "default" : "secondary"} className="text-xs">
                        {h.is_correct ? "Correct" : "Attempted"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</span>
                    </div>
                    {h.time_spent_seconds && (
                      <span className="text-xs text-muted-foreground">{Math.round(h.time_spent_seconds / 60)}m</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Interview Sessions</CardTitle></CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">No interviews yet.</p>
                <p className="mt-1 text-xs text-muted-foreground">Try an AI mock interview!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Score: {s.score}/{s.total_questions}</p>
                      <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={((s.score||0)/(s.total_questions||1)) >= 0.7 ? "default" : "secondary"} className="text-xs">
                      {Math.round(((s.score||0)/(s.total_questions||1))*100)}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
