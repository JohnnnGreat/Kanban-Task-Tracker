// src/components/modals/ColumnModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";

interface ColumnModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (title: string) => void;
   columnTitle?: string;
}

export function ColumnModal({ isOpen, onClose, onSave, columnTitle }: ColumnModalProps) {
   const [title, setTitle] = useState("");

   useEffect(() => {
      if (columnTitle) {
         setTitle(columnTitle);
      } else {
         setTitle("");
      }
   }, [columnTitle, isOpen]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim()) {
         alert("Please enter a column name");
         return;
      }

      onSave(title.trim());
      onClose();
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         {/* Backdrop */}
         <div
            className="absolute inset-0  bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
         />

         {/* Modal */}
         <div
            className={cn("relative bg-white rounded-lg shadow-xl", "w-full max-w-md mx-4")}
            role="dialog"
            aria-modal="true"
            aria-labelledby="column-modal-title"
         >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <h2
                  id="column-modal-title"
                  className="text-xl font-romie font-semibold text-black"
               >
                  {columnTitle ? "Rename Column" : "New Column"}
               </h2>
               <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close modal"
               >
                  <X className="w-5 h-5 text-gray-500" />
               </button>
            </div>

            {/* Form */}
            <form
               onSubmit={handleSubmit}
               className="p-6"
            >
               <div>
                  <label
                     htmlFor="column-title"
                     className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                     Column Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                     id="column-title"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     placeholder="e.g., In Review, Testing"
                     required
                     autoFocus
                  />
               </div>

               {/* Footer */}
               <div className="flex items-center justify-end gap-3 mt-6">
                  <Button
                     type="button"
                     variant="secondary"
                     onClick={onClose}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     variant="primary"
                  >
                     {columnTitle ? "Save Changes" : "Create Column"}
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
}
