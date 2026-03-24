"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Baby,
  Stethoscope,
  HeartPulse,
  Image,
  Heart,
  Shield,
  ShieldAlert,
  MessageSquare,
  Bell,
  BarChart3,
  Brain,
  RefreshCcw,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar } from "../ui/Avatar";
import { profileService } from "@/services";

const fallbackUser = { id: '', name: 'User', email: '', role: 'admin' as const, lastActive: '', status: 'online' as const }

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "ANC Records", href: "/dashboard/anc", icon: ClipboardList },
  { name: "Prenatal Care", href: "/dashboard/prenatal", icon: Baby },
  { name: "Delivery", href: "/dashboard/delivery", icon: Stethoscope },
  { name: "PNC", href: "/dashboard/pnc", icon: HeartPulse },
  { name: "Ultrasound", href: "/dashboard/ultrasound", icon: Image },
  { name: "SRH", href: "/dashboard/srh", icon: Heart },
  { name: "GBV Reports", href: "/dashboard/gbv", icon: Shield },
  { name: "GBV Screening", href: "/dashboard/gbv-screening", icon: ShieldAlert },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "AI Risk", href: "/dashboard/risk", icon: Brain },
  { name: "Sync Status", href: "/dashboard/sync", icon: RefreshCcw },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(fallbackUser);

  useEffect(() => {
    profileService.getMe().then(res => {
      if (res.success && res.profile) {
        setCurrentUser({
          id: res.profile.id,
          name: res.profile.fullName || fallbackUser.name,
          email: fallbackUser.email,
          role: fallbackUser.role,
          lastActive: new Date().toISOString(),
          status: "online" as const,
        });
      }
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("unfpa_refresh_token");
    if (refreshToken) {
      import("@/services").then(({ authService }) => authService.logout(refreshToken)).catch(() => {});
    }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("unfpa_access_token");
    localStorage.removeItem("unfpa_refresh_token");
    router.push("/");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
        "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 dark:border-slate-800">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
          <Heart className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              UNFPA DMP
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Maternal Health
            </p>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3 top-20 z-50 p-1.5 rounded-full",
          "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400",
          "hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-colors",
          "shadow-md"
        )}
      >
        <ChevronLeft
          className={cn(
            "w-4 h-4 transition-transform",
            isCollapsed && "rotate-180"
          )}
        />
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "group relative",
                isActive
                  ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive && "drop-shadow-glow"
                )}
              />
              {!isCollapsed && (
                <span className="font-medium text-sm animate-fade-in">
                  {item.name}
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                  {item.name}
                </div>
              )}
              {item.name === "Alerts" && (
                <span
                  className={cn(
                    "flex-shrink-0 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center",
                    isCollapsed ? "absolute -top-1 -right-1" : "ml-auto"
                  )}
                >
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900",
          isCollapsed ? "px-3" : "px-4"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <Avatar
            fallback={currentUser.name}
            status={currentUser.status}
            size="md"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {currentUser.role}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
