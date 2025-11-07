// src/components/board/ColumnHeader.tsx
"use client";

import React, { useState } from "react";
import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColumnHeaderProps {
   title: string;
   cardCount: number;
   onAddCard: () => void;
   onRename?: () => void;
   onDelete?: () => void;
}

export function ColumnHeader({
   title,
   cardCount,
   onAddCard,
   onRename,
   onDelete,
}: ColumnHeaderProps) {
   const [showMenu, setShowMenu] = useState(false);

   return (
      <div className="flex items-center justify-between mb-4 px-1">
         <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wide">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
               {cardCount} {cardCount === 1 ? "card" : "cards"}
            </p>
         </div>

         <div className="flex items-center gap-1">
            {/* Add Card Button */}
            <button
               onClick={onAddCard}
               className={cn(
                  "p-1.5 rounded hover:bg-gray-100 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500",
               )}
               aria-label="Add new card"
               title="Add card"
            >
               <Plus className="w-4 h-4 text-gray-600" />
            </button>

            {/* Column Menu */}
            <div className="relative">
               <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={cn(
                     "p-1.5 rounded hover:bg-gray-100 transition-colors",
                     "focus:outline-none focus:ring-2 focus:ring-blue-500",
                  )}
                  aria-label="Column menu"
                  title="More options"
               >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
               </button>

               {/* Dropdown Menu */}
               {showMenu && (
                  <>
                     {/* Backdrop */}
                     <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                     />

                     {/* Menu */}
                     <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        {onRename && (
                           <button
                              onClick={() => {
                                 onRename();
                                 setShowMenu(false);
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                           >
                              <Pencil className="w-4 h-4" />
                              Rename column
                           </button>
                        )}
                        {onDelete && (
                           <button
                              onClick={() => {
                                 onDelete();
                                 setShowMenu(false);
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                           >
                              <Trash2 className="w-4 h-4" />
                              Delete column
                           </button>
                        )}
                     </div>
                  </>
               )}
            </div>
         </div>
      </div>
   );
}
