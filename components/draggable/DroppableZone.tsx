// src/components/draggable/DroppableZone.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DroppableZoneProps {
   listId: string;
   onDrop: (listId: string) => void;
   onDragOver: (listId: string) => void;
   isOver: boolean;
   children: React.ReactNode;
   className?: string;
   ariaLabel?: string;
}

export function DroppableZone({
   listId,
   onDrop,
   onDragOver,
   isOver,
   children,
   className,
   ariaLabel,
}: DroppableZoneProps) {
   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      onDragOver(listId);
   };

   const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      onDragOver(listId);
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      onDrop(listId);
   };

   return (
      <div
         onDragOver={handleDragOver}
         onDragEnter={handleDragEnter}
         onDrop={handleDrop}
         role="region"
         aria-label={ariaLabel || `Droppable zone ${listId}`}
         aria-dropeffect="move"
         className={cn(
            "transition-all duration-200",
            isOver && "ring-2 ring-blue-400 ring-offset-2",
            className,
         )}
      >
         {children}
      </div>
   );
}
