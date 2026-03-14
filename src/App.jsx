import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import HomePage      from "./pages/HomePage";
import LoginPage     from "./pages/LoginPage";
import SignupPage    from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import PracticePage  from "./pages/PracticePage";
import InterviewPage from "./pages/InterviewPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage   from "./pages/ProfilePage";
import NotFound      from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/"       element={<HomePage />} />
              <Route path="/login"  element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard"   element={<DashboardPage />} />
                <Route path="/practice"    element={<PracticePage />} />
                <Route path="/interview"   element={<InterviewPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/profile"     element={<ProfilePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
