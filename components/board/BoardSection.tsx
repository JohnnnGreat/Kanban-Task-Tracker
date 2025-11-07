"use client";

import React from "react";
import { Column } from "./Column";
import { Plus, List, LayoutGrid, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Column as ColumnType } from "@/lib/types";
import { Button } from "../ui/Button";

/**
 * Board section component handling the main task display area.
 * Manages view switching and renders columns based on view (currently only kanban).
 * Delegates column interactions to parent handlers.
 */
interface BoardSectionProps {
   view: ViewType;
   onViewChange: (view: ViewType) => void;
   onAddColumn: () => void;
   columns: ColumnType[];
   onAddCard: (columnId: string) => void;
   onEditCard: (cardId: string) => void;
   onRenameColumn: (columnId: string) => void;
   onDeleteColumn: (columnId: string, title: string) => void;
   onReorderCards: (columnId: string, fromIndex: number, toIndex: number) => void;
   onMoveCard: (cardId: string, toListId: string, toIndex: number) => void;
   onAnnounce: (message: string) => void;
   onRequestMoveToList: (
      fromColumnId: string,
      cardId: string,
      currentIndex: number,
      direction: "left" | "right",
   ) => void;
   getAdjacentLists: (columnId: string) => { left?: string; right?: string } | undefined;
}

export function BoardSection({
   view,
   onViewChange,
   onAddColumn,
   columns,
   onAddCard,
   onEditCard,
   onRenameColumn,
   onDeleteColumn,
   onReorderCards,
   onMoveCard,
   onAnnounce,
   onRequestMoveToList,
   getAdjacentLists,
}: BoardSectionProps) {
   return (
      <div className="bg-accent rounded-[20px] p-4 px-6">
         {/* All Tasks Header */}
         <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-serif">All Tasks</h2>

            <Button
               onClick={onAddColumn}
               variant="primary"
            >
               <Plus className="w-4 h-4" />
               New Column
            </Button>
         </div>

         {/* View Switcher */}
         <div className="flex gap-1 border-b border-gray-200 mb-6">
            <button
               onClick={() => onViewChange("list")}
               className={cn(
                  "px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors",
                  view === "list"
                     ? "border-b-2 border-blue-500 text-blue-600"
                     : "text-gray-500 hover:text-gray-700",
               )}
               aria-pressed={view === "list"}
            >
               <List className="w-4 h-4" />
               List View
            </button>
            <button
               onClick={() => onViewChange("kanban")}
               className={cn(
                  "px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors",
                  view === "kanban"
                     ? "border-b-2 border-blue-500 text-blue-600"
                     : "text-gray-500 hover:text-gray-700",
               )}
               aria-pressed={view === "kanban"}
            >
               <LayoutGrid className="w-4 h-4" />
               Kanban View
            </button>
            <button
               onClick={() => onViewChange("calendar")}
               className={cn(
                  "px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors",
                  view === "calendar"
                     ? "border-b-2 border-blue-500 text-blue-600"
                     : "text-gray-500 hover:text-gray-700",
               )}
               aria-pressed={view === "calendar"}
            >
               <Calendar className="w-4 h-4" />
               Calendar
            </button>
         </div>

         {/* Kanban Board (extendable for other views) */}
         {view === "kanban" && (
            <div className="flex gap-4 overflow-x-auto pb-4">
               {columns.map((column) => (
                  <Column
                     key={column.id}
                     column={column}
                     onAddCard={() => onAddCard(column.id)}
                     onCardClick={onEditCard}
                     onRenameColumn={() => onRenameColumn(column.id)}
                     onDeleteColumn={() => onDeleteColumn(column.id, column.title)}
                     onReorderCards={(fromIndex, toIndex) =>
                        onReorderCards(column.id, fromIndex, toIndex)
                     }
                     onMoveCard={onMoveCard}
                     onAnnounce={onAnnounce}
                     onRequestMoveToList={(cardId, currentIndex, direction) =>
                        onRequestMoveToList(column.id, cardId, currentIndex, direction)
                     }
                     adjacentLists={getAdjacentLists(column.id)}
                  />
               ))}
            </div>
         )}
      </div>
   );
}

type ViewType = "list" | "kanban" | "calendar";
