import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <div className="relative text-center">
        <p className="mb-2 text-8xl font-extrabold tracking-tight text-primary/20">404</p>
        <h1 className="mb-3 text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mb-8 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
