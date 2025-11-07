// src/components/board/Card.tsx
"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { Card as CardType } from "@/lib/types";
import { cn, getPriorityColor, getPriorityText, getStatusColor } from "@/lib/utils";

interface CardProps {
   card: CardType;
   onClick?: () => void;
}

export function Card({ card, onClick }: CardProps) {
   return (
      <div
         className={cn(
            "bg-accent rounded-[14px] border-[1px] border-[#CBD5E1] p-4",
            " transition-all duration-200 cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "group",
         )}
         role="button"
         tabIndex={0}
         onClick={onClick}
         onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
               e.preventDefault();
               onClick?.();
            }
         }}
         aria-label={`Task: ${card.title}, Status: ${card.status}, Priority: ${card.priority}`}
      >
         {/* Header with Status Badge and Tag */}
         <div className="flex items-center justify-between mb-3">
            <span
               className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  getStatusColor(card.status),
               )}
            >
               {card.status}
            </span>
            <span className="text-xs text-gray-500 font-mono">{card.tags[0]}</span>
         </div>

         {/* Title */}
         <h4 className="text-base  font-romie font-bold text-gray-900 leading-snug">
            {card.title}
         </h4>

         {/* Priority Badge */}
         <div className="mb-4">
            <span className={cn("text-xs font-semibold", getPriorityColor(card.priority))}>
               {getPriorityText(card.priority)}
            </span>
         </div>

         {/* Hours Info and Comments */}
         <div className="flex items-end gap-4 mb-4 text-xs">
            <div className="bg-white rounded-[10px] p-4 flex gap-3 w-full">
               {" "}
               <div className="flex-1">
                  <div className="text-gray-500 mb-1">Estimated Hours</div>
                  <div className="font-medium text-black">{card.estimatedHours}</div>
               </div>
               <div className="flex-1">
                  <div className="text-gray-500 mb-1">LoggedHours</div>
                  <div className="font-medium text-black">{card.loggedHours}</div>
               </div>
            </div>

            {/* <div className="flex items-center gap-1.5 text-gray-600">
               <MessageSquare className="w-4 h-4" />
               <span className="font-medium">{card.comments}</span>
            </div> */}
         </div>

         <div className="h-[1px] w-full bg-[#CBD5E1]"></div>
         {/* Footer with Avatar Stack and Date */}
         <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2.5">
               {/* Avatar Stack */}
               <div className="flex -space-x-2">
                  {card.avatars.map((avatar) => (
                     <div
                        key={avatar.id}
                        className={cn(
                           "w-6 h-6 rounded-full border-2 border-white",
                           "flex items-center justify-center text-[10px] font-medium text-white",
                           avatar.color,
                        )}
                        title={avatar.name}
                     >
                        {avatar.initial}
                     </div>
                  ))}
               </div>

               {/* Project Lead Info */}
               <div className="text-xs">
                  <div className="text-gray-500 text-[10px] mb-0.5">Project Lead</div>
                  <div className="font-medium text-gray-900">{card.assignee}</div>
               </div>
            </div>

            {/* Due Date */}
            <div className="text-xs text-right">
               <div className="text-gray-500 text-[10px] mb-0.5">Due Date</div>
               <div className="font-medium text-gray-900">{card.dueDate}</div>
            </div>
         </div>
      </div>
   );
}
