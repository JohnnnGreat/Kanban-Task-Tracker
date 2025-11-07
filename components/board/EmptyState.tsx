"use client";

import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
   message?: string;
   submessage?: string;
}

export function EmptyState({
   message = "No cards yet",
   submessage = "Add a card to get started",
}: EmptyStateProps) {
   return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
         <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
         </div>
         <p className="text-sm font-medium text-gray-900 mb-1">{message}</p>
         <p className="text-xs text-gray-500">{submessage}</p>
      </div>
   );
}
