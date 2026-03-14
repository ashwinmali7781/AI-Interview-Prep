import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LayoutDashboard, Code, MessageSquare, User, LogOut, Menu, X, Trophy, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const AppNavbar = () => {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/dashboard",   label: "Dashboard",    icon: LayoutDashboard },
    { to: "/practice",    label: "Practice",     icon: Code },
    { to: "/interview",   label: "AI Interview", icon: MessageSquare },
    { to: "/leaderboard", label: "Leaderboard",  icon: Trophy },
    { to: "/profile",     label: "Profile",      icon: User },
  ];

  const isActive = (p) => location.pathname === p;

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo — Vite+React SVG + brand name */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <img src="/vite.svg" alt="logo" className="h-7 w-7" />
          <span className="text-[15px] font-bold tracking-tight text-foreground">
            Interview<span className="text-primary">Prep</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 rounded-lg text-[13px] font-medium ${
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 text-muted-foreground">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 text-[13px] text-muted-foreground">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                <Button variant={isActive(link.to) ? "secondary" : "ghost"} className="w-full justify-start gap-2 text-sm">
                  <link.icon className="h-4 w-4" /> {link.label}
                </Button>
              </Link>
            ))}
            <Button variant="ghost" onClick={signOut} className="w-full justify-start gap-2 text-sm text-muted-foreground">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
