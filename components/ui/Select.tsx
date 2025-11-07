// src/components/ui/Select.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
   error?: string;
}

export function Select({ className, error, children, ...props }: SelectProps) {
   return (
      <div className="w-full">
         <select
            className={cn(
               "w-full px-4 py-5 text-sm",
               "border border-gray-300 rounded-lg",
               "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
               "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
               "bg-white cursor-pointer",
               error && "border-red-500 focus:ring-red-500",
               className,
            )}
            {...props}
         >
            {children}
         </select>
         {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
   );
}
