// src/components/board/AddCardButton.tsx
"use client";

import React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddCardButtonProps {
   onClick: () => void;
}

export function AddCardButton({ onClick }: AddCardButtonProps) {
   return (
      <button
         onClick={onClick}
         className={cn(
            "w-full py-2.5 px-4 rounded-lg",
            "border-2 border-dashed border-gray-300",
            "text-sm font-medium text-gray-600",
            "hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-all duration-200",
            "flex items-center justify-center gap-2",
         )}
         aria-label="Add new card"
      >
         <Plus className="w-4 h-4" />
         Add card
      </button>
   );
}
