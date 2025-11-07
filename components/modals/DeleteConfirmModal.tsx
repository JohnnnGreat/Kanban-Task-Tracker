// src/components/modals/DeleteConfirmModal.tsx
"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";

interface DeleteConfirmModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message: string;
}

export function DeleteConfirmModal({
   isOpen,
   onClose,
   onConfirm,
   title,
   message,
}: DeleteConfirmModalProps) {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
         />

         {/* Modal */}
         <div
            className={cn("relative bg-white rounded-[20px] shadow-xl", "w-full max-w-md mx-4")}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
         >
            {/* Header */}
            <div className="flex items-start gap-4 p-6">
               <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
               </div>
               <div className="flex-1">
                  <h2
                     id="delete-modal-title"
                     className="text-lg font-romie font-bold text-black mb-2"
                  >
                     {title}
                  </h2>
                  <p
                     id="delete-modal-description"
                     className="text-sm text-gray-600"
                  >
                     {message}
                  </p>
               </div>
               <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close modal"
               >
                  <X className="w-5 h-5 text-gray-500" />
               </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 pb-6">
               <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="w-full"
               >
                  Cancel
               </Button>
               <Button
                  type="button"
                  className="w-full"
                  variant="destructive"
                  onClick={() => {
                     onConfirm();
                     onClose();
                  }}
               >
                  Delete
               </Button>
            </div>
         </div>
      </div>
   );
}
