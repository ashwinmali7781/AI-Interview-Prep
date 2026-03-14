import { Outlet } from "react-router-dom";
import { AppNavbar } from "@/components/AppNavbar";

export const AppLayout = () => (
  <div className="min-h-screen bg-background">
    <AppNavbar />
    <main className="container py-8">
      <Outlet />
    </main>
  </div>
);
