"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface DraggableItemProps {
   id: string;
   index: number;
   listId: string;
   children: React.ReactNode;
   onDragStart: (id: string, index: number, listId: string) => void;
   onDragEnd: () => void;
   onDragOver: (index: number) => void;
   isDragging: boolean;
   isGrabbed: boolean;
   onKeyboardGrab: () => void;
   onKeyboardMove: (direction: "up" | "down" | "left" | "right") => void;
   onKeyboardDrop: () => void;
   onKeyboardCancel: () => void;
   onSelect?: () => void; // For Enter: open modal when not grabbed
   ariaLabel?: string;
}

/**
 * Single draggable item wrapper. Handles mouse/keyboard events without conflicting with child interactions.
 * Focus stays on this wrapper; children are non-focusable.
 * - Space: Always toggles grab/drop (drag priority).
 * - Enter: Select (modal) if not grabbed; drop if grabbed.
 * - Arrows: Move when grabbed.
 * - Esc: Cancel when grabbed.
 */
export function DraggableItem({
   id,
   index,
   listId,
   children,
   onDragStart,
   onDragEnd,
   onDragOver,
   isDragging,
   isGrabbed,
   onKeyboardGrab,
   onKeyboardMove,
   onKeyboardDrop,
   onKeyboardCancel,
   onSelect,
   ariaLabel,
}: DraggableItemProps) {
   const itemRef = useRef<HTMLDivElement>(null);

   const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
      onDragStart(id, index, listId);
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      onDragOver(index);
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      e.stopPropagation(); // Always stop to prevent child bubbling

      // Space: Always toggle grab/drop (drag priority per spec)
      if (e.key === " ") {
         e.preventDefault();
         if (isGrabbed) {
            onKeyboardDrop();
         } else {
            onKeyboardGrab();
         }
         return;
      }

      // Enter: Select (modal) if not grabbed; drop if grabbed
      if (e.key === "Enter") {
         e.preventDefault();
         if (isGrabbed) {
            onKeyboardDrop();
         } else {
            onSelect?.(); // Open modal
         }
         return;
      }

      // Cancel with Escape (only when grabbed)
      if (e.key === "Escape" && isGrabbed) {
         e.preventDefault();
         onKeyboardCancel();
         return;
      }

      // Move with arrow keys (only when grabbed)
      if (isGrabbed) {
         e.preventDefault();
         if (e.key === "ArrowUp") {
            onKeyboardMove("up");
         } else if (e.key === "ArrowDown") {
            onKeyboardMove("down");
         } else if (e.key === "ArrowLeft") {
            onKeyboardMove("left");
         } else if (e.key === "ArrowRight") {
            onKeyboardMove("right");
         }
      }
   };

   return (
      <div
         ref={itemRef}
         draggable={!isGrabbed}
         onDragStart={handleDragStart}
         onDragEnd={onDragEnd}
         onDragOver={handleDragOver}
         onKeyDown={handleKeyDown}
         tabIndex={0}
         role="button"
         aria-grabbed={isGrabbed}
         aria-label={ariaLabel || `Draggable item ${index + 1}`}
         aria-describedby={isGrabbed ? "drag-instructions" : undefined}
         className={cn(
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg relative", // Added relative for badge
            isDragging && "opacity-40",
            isGrabbed && "ring-2 ring-blue-500 ring-offset-2",
         )}
      >
         {/* Non-focusable wrapper for children—prevents focus stealing/event conflicts */}
         <div
            tabIndex={-1}
            className="w-full"
         >
            {children}
         </div>

         {/* Grabbed badge */}
         {isGrabbed && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium shadow-lg">
               Grabbed
            </div>
         )}
      </div>
   );
}
