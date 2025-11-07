// src/components/modals/CardModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, Priority } from "@/lib/types";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";

import { cn } from "@/lib/utils";
import { availableAssignees, availableStatuses } from "@/data/initialData";
import { Button } from "../ui/Button";

interface CardModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (card: Partial<Card>) => void;
   card?: Card | null;
   columnId: string;
}

export function CardModal({ isOpen, onClose, onSave, card, columnId }: CardModalProps) {
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      status: "BILLABLE",
      priority: "medium" as Priority,
      estimatedHours: 0,
      assignee: "",
      dueDate: "",
   });

   useEffect(() => {
      if (card) {
         setFormData({
            title: card.title,
            description: card.description || "",
            status: card.status,
            priority: card.priority,
            estimatedHours: card.estimatedHours,
            assignee: card.assignee || "",
            dueDate: card.dueDate,
         });
      } else {
         // Reset form for new card
         setFormData({
            title: "",
            description: "",
            status: "BILLABLE",
            priority: "medium",
            estimatedHours: 0,
            assignee: "",
            dueDate: "",
         });
      }
   }, [card, isOpen]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.title.trim()) {
         alert("Please enter a card title");
         return;
      }

      onSave({
         ...formData,
         columnId,
      });

      onClose();
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
         />

         {/* Modal */}
         <div
            className={cn(
               "relative bg-white rounded-[20px] shadow-xl",
               "w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto",
               "max-h-[90vh] overflow-y-auto",
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
         >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
               <h2
                  id="modal-title"
                  className="text-lg sm:text-xl font-semibold font-romie text-gray-900"
               >
                  {card ? "Edit Card" : "New Card"}
               </h2>
               <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close modal"
               >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
               </button>
            </div>

            {/* Form */}
            <form
               onSubmit={handleSubmit}
               className="p-4 sm:p-6"
            >
               <div className="space-y-4 sm:space-y-5">
                  {/* Card Title */}
                  <div>
                     <label
                        htmlFor="title"
                        className="block text-sm font-medium text-black mb-1.5"
                     >
                        Card Title <span className="text-red-500">*</span>
                     </label>
                     <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter card title"
                        required
                        autoFocus
                        className="w-full"
                     />
                  </div>

                  {/* Description */}
                  <div>
                     <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                     >
                        Description <span className="text-gray-400">(optional)</span>
                     </label>
                     <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Add more details..."
                        rows={3}
                        className="w-full"
                     />
                  </div>

                  {/* Status and Priority Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {/* Status */}
                     <div>
                        <label
                           htmlFor="status"
                           className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                           Status
                        </label>
                        <Select
                           id="status"
                           value={formData.status}
                           onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                           className="w-full"
                        >
                           {availableStatuses.map((status) => (
                              <option
                                 key={status}
                                 value={status}
                              >
                                 {status}
                              </option>
                           ))}
                        </Select>
                     </div>

                     {/* Priority */}
                     <div>
                        <label
                           htmlFor="priority"
                           className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                           Priority
                        </label>
                        <Select
                           id="priority"
                           value={formData.priority}
                           onChange={(e) =>
                              setFormData({ ...formData, priority: e.target.value as Priority })
                           }
                           className="w-full"
                        >
                           <option value="low">Low</option>
                           <option value="medium">Medium</option>
                           <option value="high">High</option>
                        </Select>
                     </div>
                  </div>

                  {/* Assignee */}
                  <div>
                     <label
                        htmlFor="assignee"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                     >
                        Assignee
                     </label>
                     <Select
                        id="assignee"
                        value={formData.assignee}
                        onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                        className="w-full"
                     >
                        <option value="">Select assignee</option>
                        {availableAssignees.map((assignee) => (
                           <option
                              key={assignee}
                              value={assignee}
                           >
                              {assignee}
                           </option>
                        ))}
                     </Select>
                  </div>

                  {/* Estimated Hours and Due Date Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {/* Estimated Hours */}
                     <div>
                        <label
                           htmlFor="estimatedHours"
                           className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                           Estimated Hours
                        </label>
                        <Input
                           id="estimatedHours"
                           type="number"
                           step="0.5"
                           min="0"
                           value={formData.estimatedHours}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 estimatedHours: parseFloat(e.target.value) || 0,
                              })
                           }
                           placeholder="0"
                           className="w-full"
                        />
                     </div>

                     {/* Due Date */}
                     <div>
                        <label
                           htmlFor="dueDate"
                           className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                           Due Date
                        </label>
                        <Input
                           id="dueDate"
                           type="date"
                           value={formData.dueDate}
                           onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                           className="w-full"
                        />
                     </div>
                  </div>
               </div>

               {/* Footer */}
               <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button
                     type="button"
                     variant="secondary"
                     onClick={onClose}
                     className="w-full sm:w-auto"
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     variant="primary"
                     className="w-full sm:w-auto"
                  >
                     {card ? "Save Changes" : "Create Card"}
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
}
