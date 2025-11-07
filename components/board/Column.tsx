// src/components/board/Column.tsx
"use client";

import React from "react";
import { ColumnHeader } from "./ColumnHeader";
import { Column as ColumnType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { AddCardButton } from "./AddCardButton";
import { Card } from "./Card";
import { DraggableList } from "../draggable/DraggableList";

interface ColumnProps {
   column: ColumnType;
   onAddCard: () => void;
   onCardClick?: (cardId: string) => void;
   onRenameColumn?: () => void;
   onDeleteColumn?: () => void;
   onReorderCards?: (from: number, to: number) => void;
   onMoveCard?: (cardId: string, toListId: string, toIndex: number) => void;
   onAnnounce?: (message: string) => void;
   // New props for cross-column keyboard navigation
   onRequestMoveToList?: (
      itemId: string,
      currentIndex: number,
      direction: "left" | "right",
   ) => void;
   adjacentLists?: {
      left?: string;
      right?: string;
   };
}

export function Column({
   column,
   onAddCard,
   onCardClick,
   onRenameColumn,
   onDeleteColumn,
   onReorderCards,
   onMoveCard,
   onAnnounce,
   onRequestMoveToList,
   adjacentLists,
}: ColumnProps) {
   return (
      <div className="flex-shrink-0 w-[340px] bg-white p-4 rounded-[20px]">
         {/* Column Header */}
         <ColumnHeader
            title={column.title}
            cardCount={column.cards.length}
            onAddCard={onAddCard}
            onRename={onRenameColumn}
            onDelete={onDeleteColumn}
         />

         {/* Cards Container */}
         <div
            className={cn(
               "min-h-[200px] rounded-[20px]",
               column.cards.length === 0
                  ? "bg-white border-2 border-dashed border-gray-200"
                  : "bg-white",
            )}
            role="list"
            aria-label={`${column.title} column`}
         >
            {column.cards.length === 0 ? (
               <EmptyState />
            ) : (
               <DraggableList
                  items={column.cards}
                  listId={column.id}
                  direction="vertical"
                  className="space-y-3"
                  ariaLabel={`${column.title} cards`}
                  onReorder={(fromIndex, toIndex) => {
                     onReorderCards?.(fromIndex, toIndex);
                  }}
                  onMove={(cardId, toListId, toIndex) => {
                     onMoveCard?.(cardId, toListId, toIndex);
                  }}
                  onAnnounce={onAnnounce}
                  onRequestMoveToList={onRequestMoveToList}
                  adjacentLists={adjacentLists}
                  renderItem={(card, index, isDragging, isGrabbed) => (
                     <div className={cn(isDragging && "opacity-50")}>
                        <Card
                           card={card}
                           onClick={() => onCardClick?.(card.id)}
                        />
                     </div>
                  )}
               />
            )}

            {/* Add Card Button at bottom */}
            {column.cards.length > 0 && (
               <div className="mt-3">
                  <AddCardButton onClick={onAddCard} />
               </div>
            )}
         </div>
      </div>
   );
}
