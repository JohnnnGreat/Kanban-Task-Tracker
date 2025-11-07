// src/components/ui/Input.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   error?: string;
}

export function Input({ className, error, ...props }: InputProps) {
   return (
      <div className="w-full">
         <input
            className={cn(
               "w-full px-4 py-5 text-sm",
               "border border-gray-300 rounded-lg",
               "focus:outline-none font-albert-sans focus:ring-2 focus:ring-blue-500 focus:border-transparent",
               "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
               "placeholder:text-gray-400",
               error && "border-red-500 focus:ring-red-500",
               className,
            )}
            {...props}
         />
         {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
   );
}
