// src/components/board/Board.tsx
"use client";

import React, { useState } from "react";
import { useBoard } from "@/context/BoardContext";

import { CardModal } from "../modals/CardModals";
import { ColumnModal } from "../modals/ColumnModal";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";
import { Card as CardType } from "@/lib/types";
import { LiveRegion } from "./LiveRegion";
import { BoardHeader } from "./BoardHeader";
import { BreadcrumbTabs } from "./BreadcrumbTable";
import { StatsCards } from "./StatsCard";
import { BoardSection } from "./BoardSection";

/**
 * Main Board component that orchestrates the task tracker UI.
 * It manages high-level state (e.g., view type, announcements) and composes
 * sub-components for header, navigation, stats, and the board content.
 * Uses the BoardContext for data and mutations.
 */
export function Board() {
   const {
      board,
      addColumn,
      updateColumn,
      deleteColumn,
      addCard,
      updateCard,
      deleteCard,
      moveCard,
      reorderCards,
   } = useBoard();

   const [view, setView] = useState<ViewType>("kanban");
   const [announcement, setAnnouncement] = useState("");

   // Card Modal State
   const [isCardModalOpen, setIsCardModalOpen] = useState(false);
   const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
   const [selectedColumnId, setSelectedColumnId] = useState<string>("");

   // Column Modal State
   const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
   const [editingColumnId, setEditingColumnId] = useState<string | null>(null);

   // Delete Confirm Modal State
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [deleteTarget, setDeleteTarget] = useState<{
      type: "card" | "column";
      id: string;
      title: string;
   } | null>(null);

   const handleAnnounce = (message: string) => {
      setAnnouncement(message);
   };

   // Card Handlers
   const handleAddCard = (columnId: string) => {
      setSelectedColumnId(columnId);
      setSelectedCard(null);
      setIsCardModalOpen(true);
   };

   const handleEditCard = (cardId: string) => {
      const card = board.columns.flatMap((col) => col.cards).find((c) => c.id === cardId);

      if (card) {
         setSelectedCard(card);
         setSelectedColumnId(card.columnId);
         setIsCardModalOpen(true);
      }
   };

   const handleSaveCard = (cardData: Partial<CardType>) => {
      if (selectedCard) {
         updateCard(selectedCard.id, cardData);
         handleAnnounce(`Updated card "${cardData.title}"`);
      } else {
         addCard(selectedColumnId, cardData as any);
         handleAnnounce(`Created card "${cardData.title}"`);
      }
   };

   const handleDeleteCardClick = (cardId: string, cardTitle: string) => {
      setDeleteTarget({ type: "card", id: cardId, title: cardTitle });
      setIsDeleteModalOpen(true);
   };

   // Column Handlers
   const handleAddColumn = () => {
      setEditingColumnId(null);
      setIsColumnModalOpen(true);
   };

   const handleRenameColumn = (columnId: string) => {
      setEditingColumnId(columnId);
      setIsColumnModalOpen(true);
   };

   const handleSaveColumn = (title: string) => {
      if (editingColumnId) {
         updateColumn(editingColumnId, title);
         handleAnnounce(`Renamed column to "${title}"`);
      } else {
         addColumn(title);
         handleAnnounce(`Created column "${title}"`);
      }
   };

   const handleDeleteColumnClick = (columnId: string, columnTitle: string) => {
      setDeleteTarget({ type: "column", id: columnId, title: columnTitle });
      setIsDeleteModalOpen(true);
   };

   // Delete Confirmation
   const handleConfirmDelete = () => {
      if (!deleteTarget) return;

      if (deleteTarget.type === "card") {
         deleteCard(deleteTarget.id);
         handleAnnounce(`Deleted card "${deleteTarget.title}"`);
      } else {
         deleteColumn(deleteTarget.id);
         handleAnnounce(`Deleted column "${deleteTarget.title}"`);
      }

      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
   };

   // Drag & Drop Handlers
   const handleReorderCards = (columnId: string, fromIndex: number, toIndex: number) => {
      reorderCards(columnId, fromIndex, toIndex);
   };

   const handleMoveCard = (cardId: string, toListId: string, toIndex: number) => {
      moveCard(cardId, toListId, toIndex);
   };

   // Cross-Column Keyboard Navigation Handler
   const handleRequestMoveToList = (
      fromColumnId: string,
      cardId: string,
      currentIndex: number,
      direction: "left" | "right",
   ) => {
      const currentColumnIndex = board.columns.findIndex((col) => col.id === fromColumnId);
      if (currentColumnIndex === -1) return;

      // Determine target column
      const targetColumnIndex =
         direction === "left" ? currentColumnIndex - 1 : currentColumnIndex + 1;

      if (targetColumnIndex < 0 || targetColumnIndex >= board.columns.length) {
         handleAnnounce(`No column to the ${direction}`);
         return;
      }

      const targetColumn = board.columns[targetColumnIndex];
      const card = board.columns[currentColumnIndex].cards[currentIndex];

      // Move to the end of the target column (can be enhanced to preserve position)
      const targetIndex = targetColumn.cards.length;

      // Perform the move
      moveCard(cardId, targetColumn.id, targetIndex);

      // Announce the move
      handleAnnounce(
         `Moved "${card.title}" to ${targetColumn.title} at position ${targetIndex + 1}`,
      );
   };

   // Helper to get adjacent columns for keyboard navigation
   const getAdjacentLists = (columnId: string) => {
      const currentIndex = board.columns.findIndex((col) => col.id === columnId);
      if (currentIndex === -1) return undefined;

      return {
         left: currentIndex > 0 ? board.columns[currentIndex - 1].id : undefined,
         right:
            currentIndex < board.columns.length - 1
               ? board.columns[currentIndex + 1].id
               : undefined,
      };
   };

   // Calculate stats
   const openToday = board.columns.reduce(
      (acc, col) => acc + (col.id === "todo" ? col.cards.length : 0),
      0,
   );
   const overdue = 10; // Placeholder
   const doneThisWeek = board.columns.reduce(
      (acc, col) => acc + (col.id === "done" ? col.cards.length : 0),
      0,
   );

   const editingColumn = editingColumnId
      ? board.columns.find((col) => col.id === editingColumnId)
      : null;

   return (
      <div className=" overflow-hidden">
         {/* Live Region for Screen Reader Announcements */}
         <LiveRegion message={announcement} />

         <BoardHeader />

         <BreadcrumbTabs />

         <StatsCards
            openToday={openToday}
            overdue={overdue}
            doneThisWeek={doneThisWeek}
         />

         <BoardSection
            view={view}
            onViewChange={setView}
            onAddColumn={handleAddColumn}
            columns={board.columns}
            onAddCard={handleAddCard}
            onEditCard={handleEditCard}
            onRenameColumn={handleRenameColumn}
            onDeleteColumn={handleDeleteColumnClick}
            onReorderCards={handleReorderCards}
            onMoveCard={handleMoveCard}
            onAnnounce={handleAnnounce}
            onRequestMoveToList={handleRequestMoveToList}
            getAdjacentLists={getAdjacentLists}
         />

         {/* Modals */}
         <CardModal
            isOpen={isCardModalOpen}
            onClose={() => {
               setIsCardModalOpen(false);
               setSelectedCard(null);
            }}
            onSave={handleSaveCard}
            card={selectedCard}
            columnId={selectedColumnId}
         />

         <ColumnModal
            isOpen={isColumnModalOpen}
            onClose={() => {
               setIsColumnModalOpen(false);
               setEditingColumnId(null);
            }}
            onSave={handleSaveColumn}
            columnTitle={editingColumn?.title}
         />

         <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
               setIsDeleteModalOpen(false);
               setDeleteTarget(null);
            }}
            onConfirm={handleConfirmDelete}
            title={deleteTarget?.type === "card" ? "Delete Card?" : "Delete Column?"}
            message={
               deleteTarget?.type === "card"
                  ? `Are you sure you want to delete "${deleteTarget.title}"?`
                  : `This will permanently delete "${deleteTarget?.title}" and all its cards. This action cannot be undone.`
            }
         />
      </div>
   );
}

type ViewType = "list" | "kanban" | "calendar";
