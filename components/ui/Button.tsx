// src/components/ui/Button.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: "primary" | "secondary" | "ghost" | "destructive";
   size?: "sm" | "md" | "lg";
   children: React.ReactNode;
}

export function Button({
   variant = "primary",
   size = "md",
   className,
   children,
   ...props
}: ButtonProps) {
   const baseStyles =
      "inline-flex items-center cursor-pointer justify-center font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

   const variants = {
      primary: "bg-black text-white hover:bg-black/80 focus:ring-black/50",
      secondary:
         "bg-gray-100 border border-black text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
      ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
   };

   const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-8 py-5 text-sm",
      lg: "px-6 py-3 text-base",
   };

   return (
      <button
         className={cn(baseStyles, variants[variant], sizes[size], className)}
         {...props}
      >
         {children}
      </button>
   );
}
