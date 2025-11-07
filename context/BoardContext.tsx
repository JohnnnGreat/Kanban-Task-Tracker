// src/context/BoardContext.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Board, Column, Card } from "@/lib/types";
import { initialBoard } from "@/data/initialData";
import { generateId } from "@/lib/utils";

interface BoardContextType {
   board: Board;
   addColumn: (title: string) => void;
   updateColumn: (id: string, title: string) => void;
   deleteColumn: (id: string) => void;
   addCard: (
      columnId: string,
      card: Omit<
         Card,
         | "id"
         | "createdAt"
         | "updatedAt"
         | "order"
         | "comments"
         | "tags"
         | "avatars"
         | "loggedHours"
      >,
   ) => void;
   updateCard: (cardId: string, updates: Partial<Card>) => void;
   deleteCard: (cardId: string) => void;
   moveCard: (cardId: string, targetColumnId: string, newOrder: number) => void;
   reorderCards: (columnId: string, fromIndex: number, toIndex: number) => void;
}

type Action =
   | { type: "SET_BOARD"; payload: Board }
   | { type: "ADD_COLUMN"; payload: { title: string } }
   | { type: "UPDATE_COLUMN"; payload: { id: string; title: string } }
   | { type: "DELETE_COLUMN"; payload: { id: string } }
   | { type: "ADD_CARD"; payload: { columnId: string; card: Card } }
   | { type: "UPDATE_CARD"; payload: { cardId: string; updates: Partial<Card> } }
   | { type: "DELETE_CARD"; payload: { cardId: string } }
   | { type: "MOVE_CARD"; payload: { cardId: string; targetColumnId: string; newOrder: number } }
   | { type: "REORDER_CARDS"; payload: { columnId: string; fromIndex: number; toIndex: number } };

const BoardContext = createContext<BoardContextType | undefined>(undefined);

const STORAGE_KEY = "kanban-board-state";

function boardReducer(state: Board, action: Action): Board {
   switch (action.type) {
      case "SET_BOARD":
         return action.payload;

      case "ADD_COLUMN": {
         const newColumn: Column = {
            id: generateId(),
            title: action.payload.title,
            order: state.columns.length,
            cards: [],
         };
         return {
            ...state,
            columns: [...state.columns, newColumn],
         };
      }

      case "UPDATE_COLUMN": {
         return {
            ...state,
            columns: state.columns.map((col) =>
               col.id === action.payload.id ? { ...col, title: action.payload.title } : col,
            ),
         };
      }

      case "DELETE_COLUMN": {
         return {
            ...state,
            columns: state.columns.filter((col) => col.id !== action.payload.id),
         };
      }

      case "ADD_CARD": {
         const column = state.columns.find((col) => col.id === action.payload.columnId);
         if (!column) return state;

         return {
            ...state,
            columns: state.columns.map((col) =>
               col.id === action.payload.columnId
                  ? { ...col, cards: [...col.cards, action.payload.card] }
                  : col,
            ),
         };
      }

      case "UPDATE_CARD": {
         return {
            ...state,
            columns: state.columns.map((col) => ({
               ...col,
               cards: col.cards.map((card) =>
                  card.id === action.payload.cardId
                     ? { ...card, ...action.payload.updates, updatedAt: new Date() }
                     : card,
               ),
            })),
         };
      }

      case "DELETE_CARD": {
         return {
            ...state,
            columns: state.columns.map((col) => ({
               ...col,
               cards: col.cards.filter((card) => card.id !== action.payload.cardId),
            })),
         };
      }

      case "MOVE_CARD": {
         const { cardId, targetColumnId, newOrder } = action.payload;
         let cardToMove: Card | null = null;
         let sourceColumnId = "";

         // Find and remove the card from its current column
         const columnsWithoutCard = state.columns.map((col) => {
            const card = col.cards.find((c) => c.id === cardId);
            if (card) {
               cardToMove = card;
               sourceColumnId = col.id;
               return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
            }
            return col;
         });

         if (!cardToMove) return state;

         // Add the card to the target column at the specified position
         const updatedColumns = columnsWithoutCard.map((col) => {
            if (col.id === targetColumnId) {
               const newCards = [...col.cards];
               newCards.splice(newOrder, 0, {
                  ...cardToMove!,
                  columnId: targetColumnId,
                  order: newOrder,
               });

               // Update order for all cards in the column
               return {
                  ...col,
                  cards: newCards.map((card, idx) => ({ ...card, order: idx })),
               };
            }
            return col;
         });

         return { ...state, columns: updatedColumns };
      }

      case "REORDER_CARDS": {
         const { columnId, fromIndex, toIndex } = action.payload;

         return {
            ...state,
            columns: state.columns.map((col) => {
               if (col.id === columnId) {
                  const newCards = [...col.cards];
                  const [movedCard] = newCards.splice(fromIndex, 1);
                  newCards.splice(toIndex, 0, movedCard);

                  // Update order for all cards
                  return {
                     ...col,
                     cards: newCards.map((card, idx) => ({ ...card, order: idx })),
                  };
               }
               return col;
            }),
         };
      }

      default:
         return state;
   }
}

export function BoardProvider({ children }: { children: ReactNode }) {
   const [board, dispatch] = useReducer(boardReducer, initialBoard);

   // Load from localStorage on mount
   useEffect(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
         try {
            const parsed = JSON.parse(saved);
            // Convert date strings back to Date objects
            const boardWithDates = {
               ...parsed,
               columns: parsed.columns.map((col: any) => ({
                  ...col,
                  cards: col.cards.map((card: any) => ({
                     ...card,
                     createdAt: new Date(card.createdAt),
                     updatedAt: new Date(card.updatedAt),
                  })),
               })),
            };
            dispatch({ type: "SET_BOARD", payload: boardWithDates });
         } catch (error) {
            console.error("Failed to load board state:", error);
         }
      }
   }, []);

   // Save to localStorage whenever board changes
   useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
   }, [board]);

   const addColumn = (title: string) => {
      dispatch({ type: "ADD_COLUMN", payload: { title } });
   };

   const updateColumn = (id: string, title: string) => {
      dispatch({ type: "UPDATE_COLUMN", payload: { id, title } });
   };

   const deleteColumn = (id: string) => {
      dispatch({ type: "DELETE_COLUMN", payload: { id } });
   };

   const addCard = (
      columnId: string,
      cardData: Omit<
         Card,
         | "id"
         | "createdAt"
         | "updatedAt"
         | "order"
         | "comments"
         | "tags"
         | "avatars"
         | "loggedHours"
      >,
   ) => {
      const column = board.columns.find((col) => col.id === columnId);
      if (!column) return;

      const newCard: Card = {
         ...cardData,
         id: generateId(),
         order: column.cards.length,
         comments: 0,
         loggedHours: 0,
         tags: ["t7kfa3"],
         avatars: [
            { id: "1", name: "Dana Lee", color: "bg-blue-500", initial: "D" },
            { id: "2", name: "Alex Smith", color: "bg-purple-500", initial: "A" },
            { id: "3", name: "Jane Doe", color: "bg-green-500", initial: "J" },
            { id: "4", name: "Mike Ross", color: "bg-orange-500", initial: "M" },
         ],
         createdAt: new Date(),
         updatedAt: new Date(),
      };

      dispatch({ type: "ADD_CARD", payload: { columnId, card: newCard } });
   };

   const updateCard = (cardId: string, updates: Partial<Card>) => {
      dispatch({ type: "UPDATE_CARD", payload: { cardId, updates } });
   };

   const deleteCard = (cardId: string) => {
      dispatch({ type: "DELETE_CARD", payload: { cardId } });
   };

   const moveCard = (cardId: string, targetColumnId: string, newOrder: number) => {
      dispatch({ type: "MOVE_CARD", payload: { cardId, targetColumnId, newOrder } });
   };

   const reorderCards = (columnId: string, fromIndex: number, toIndex: number) => {
      dispatch({ type: "REORDER_CARDS", payload: { columnId, fromIndex, toIndex } });
   };

   return (
      <BoardContext.Provider
         value={{
            board,
            addColumn,
            updateColumn,
            deleteColumn,
            addCard,
            updateCard,
            deleteCard,
            moveCard,
            reorderCards,
         }}
      >
         {children}
      </BoardContext.Provider>
   );
}

export function useBoard() {
   const context = useContext(BoardContext);
   if (!context) {
      throw new Error("useBoard must be used within BoardProvider");
   }
   return context;
}
