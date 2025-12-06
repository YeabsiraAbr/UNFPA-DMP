import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function calculateGestationalAge(lmpDate: Date | string): {
  weeks: number;
  days: number;
} {
  const lmp = new Date(lmpDate);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24)
  );
  return {
    weeks: Math.floor(diffDays / 7),
    days: diffDays % 7,
  };
}

export function getRiskLevel(
  score: number
): "low" | "medium" | "high" | "critical" {
  if (score < 25) return "low";
  if (score < 50) return "medium";
  if (score < 75) return "high";
  return "critical";
}

export function getRiskColor(
  level: "low" | "medium" | "high" | "critical"
): string {
  switch (level) {
    case "low":
      return "text-green-600 bg-green-50 border-green-200";
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "high":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}


