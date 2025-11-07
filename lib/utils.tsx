import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function generateId(): string {
   return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date: Date | string): string {
   const d = typeof date === "string" ? new Date(date) : date;
   return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
   }).format(d);
}

// Card Utilities
export const getStatusColor = (status: string) => {
   if (status === "BILLABLE") return "bg-blue-50 text-0270FF border-blue-200";
   if (status === "Submitted") return "bg-blue-50 text-0270FF border-blue-200";
   if (status === "In Review") return "bg-purple-50 text-purple-700 border-purple-200";
   if (status === "Blocked") return "bg-red-50 text-red-700 border-red-200";
   return "bg-gray-50 text-gray-700 border-gray-200";
};

export const getPriorityText = (priority: string) => {
   return priority.toUpperCase();
};

export const getPriorityColor = (priority: string) => {
   if (priority === "high") return "text-red-600";
   if (priority === "medium") return "text-yellow-600";
   return "text-green-600";
};
