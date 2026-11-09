import React from "react";
import { Wallet, ShieldAlert } from "lucide-react";
import useAuthStore from "../../lib/store/authStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const DashboardHeader = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      clearAuth();
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  };
  const isAdmin = user?.role === "admin";
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
            <Wallet className="h-5 w-5 text-white" />
          </div>

          <h1 className="text-xl font-bold text-foreground">Finance Tracker</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome,{" "}
            <span className="font-semibold text-foreground">
              {user?.name || user?.email || "User"}
            </span>
          </span>

          {isAdmin && (
            <Button
              variant="default"
              onClick={() => navigate("/admin")}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium gap-2"
            >
              <ShieldAlert className="h-4 w-4" />
              Admin Panel
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="cursor-pointer border-border hover:bg-muted text-sm font-medium"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
