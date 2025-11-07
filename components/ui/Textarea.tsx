// src/components/ui/Textarea.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
   error?: string;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
   return (
      <div className="w-full">
         <textarea
            className={cn(
               "w-full px-3 py-2 text-sm",
               "border border-gray-300 rounded-lg",
               "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
               "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
               "placeholder:text-gray-400",
               "resize-none",
               error && "border-red-500 focus:ring-red-500",
               className,
            )}
            {...props}
         />
         {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
   );
}
