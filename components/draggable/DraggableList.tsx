"use client";

import React, { useState, useCallback, useReducer } from "react";
import { DraggableItem } from "./DraggableItem";
import { DroppableZone } from "./DroppableZone";
import { DragOverlay } from "./DragOverlay";
import { cn } from "@/lib/utils";

interface DraggableItemData {
   id: string;
   [key: string]: any;
}

interface DraggableListProps<T extends DraggableItemData> {
   items: T[];
   renderItem: (item: T, index: number, isDragging: boolean, isGrabbed: boolean) => React.ReactNode;
   onReorder: (fromIndex: number, toIndex: number) => void;
   onMove?: (itemId: string, toListId: string, toIndex: number) => void;
   listId: string;
   direction?: "vertical" | "horizontal";
   className?: string;
   ariaLabel?: string;
   onAnnounce?: (message: string) => void;
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

/**
 * Reusable DraggableList component supporting mouse and keyboard drag-and-drop.
 * Handles reordering within a list and moving items across lists (e.g., columns).
 * Provides ARIA attributes and live announcements for accessibility.
 *
 * @template T - Generic type extending DraggableItemData for type-safe items.
 * @param props - See interface for details.
 * @returns JSX.Element
 *
 * Usage Example:
 * ```tsx
 * <DraggableList
 *   items={cards}
 *   renderItem={(card, index, isDragging) => <Card card={card} />}
 *   onReorder={handleReorder}
 *   onMove={handleMove}
 *   listId="column-1"
 *   ariaLabel="To Do cards"
 *   onAnnounce={announce}
 * />
 * ```
 */
export function DraggableList<T extends DraggableItemData>({
   items,
   renderItem,
   onReorder,
   onMove,
   listId,
   direction = "vertical",
   className,
   ariaLabel,
   onAnnounce,
   onRequestMoveToList,
   adjacentLists,
}: DraggableListProps<T>) {
   const [isOverList, setIsOverList] = useState(false);
   const [draggedItemNode, setDraggedItemNode] = useState<React.ReactNode | null>(null);

   // Drag state reducer to manage mouse/keyboard states atomically
   type DragAction =
      | { type: "START_MOUSE_DRAG"; id: string; index: number; fromListId: string }
      | { type: "UPDATE_OVER_INDEX"; index: number }
      | { type: "END_DRAG" }
      | { type: "START_KEYBOARD_GRAB"; id: string; index: number }
      | { type: "UPDATE_GRABBED_INDEX"; index: number }
      | { type: "CANCEL_GRAB" };

   interface DragState {
      draggedItemId: string | null;
      draggedItemIndex: number | null;
      draggedFromListId: string | null;
      draggedOverIndex: number | null;
      dragType: "mouse" | "keyboard" | null;
      grabbedItemId: string | null;
      grabbedItemIndex: number | null;
      grabbedFromListId: string | null;
   }

   const dragReducer = (state: DragState, action: DragAction): DragState => {
      switch (action.type) {
         case "START_MOUSE_DRAG":
            return {
               ...state,
               draggedItemId: action.id,
               draggedItemIndex: action.index,
               draggedFromListId: action.fromListId,
               dragType: "mouse",
            };
         case "UPDATE_OVER_INDEX":
            return { ...state, draggedOverIndex: action.index };
         case "START_KEYBOARD_GRAB":
            return {
               ...state,
               grabbedItemId: action.id,
               grabbedItemIndex: action.index,
               grabbedFromListId: listId,
               dragType: "keyboard",
            };
         case "UPDATE_GRABBED_INDEX":
            return { ...state, grabbedItemIndex: action.index };
         case "END_DRAG":
         case "CANCEL_GRAB":
            return {
               draggedItemId: null,
               draggedItemIndex: null,
               draggedFromListId: null,
               draggedOverIndex: null,
               dragType: null,
               grabbedItemId: null,
               grabbedItemIndex: null,
               grabbedFromListId: null,
            };
         default:
            return state;
      }
   };

   const [dragState, dispatch] = useReducer(dragReducer, {
      draggedItemId: null,
      draggedItemIndex: null,
      draggedFromListId: null,
      draggedOverIndex: null,
      dragType: null,
      grabbedItemId: null,
      grabbedItemIndex: null,
      grabbedFromListId: null,
   });

   // Mouse drag handlers
   const handleDragStart = useCallback(
      (id: string, index: number, fromListId: string) => {
         dispatch({
            type: "START_MOUSE_DRAG",
            id,
            index,
            fromListId,
         });
         setDraggedItemNode(renderItem(items[index] as T, index, true, false));
      },
      [items, renderItem],
   );

   const handleDragOver = useCallback((index: number) => {
      dispatch({ type: "UPDATE_OVER_INDEX", index });
   }, []);

   const handleDragOverList = useCallback(
      (targetListId: string) => {
         setIsOverList(targetListId === listId);
      },
      [listId],
   );

   const resetDragState = useCallback(() => {
      dispatch({ type: "END_DRAG" });
      setIsOverList(false);
      setDraggedItemNode(null);
   }, []);

   const handleDrop = useCallback(
      (targetListId: string) => {
         const { draggedItemId, draggedItemIndex, draggedFromListId, draggedOverIndex } = dragState;
         if (!draggedItemId || draggedItemIndex === null) return;

         const targetIndex = draggedOverIndex ?? items.length - 1;

         if (draggedFromListId === targetListId && draggedFromListId === listId) {
            // Same list reorder
            if (draggedItemIndex !== targetIndex) {
               onReorder(draggedItemIndex, targetIndex);
               const itemTitle =
                  (items[draggedItemIndex] as any).title || `Item ${draggedItemIndex + 1}`;
               onAnnounce?.(
                  `Moved "${itemTitle}" from position ${draggedItemIndex + 1} to position ${
                     targetIndex + 1
                  }`,
               );
            }
         } else if (targetListId === listId && onMove) {
            // Move to different list
            onMove(draggedItemId, targetListId, targetIndex);
            const item = items.find((i) => i.id === draggedItemId);
            const itemTitle = (item as any)?.title || "Item";
            onAnnounce?.(
               `Moved "${itemTitle}" to ${ariaLabel || listId} at position ${targetIndex + 1}`,
            );
         }

         resetDragState();
      },
      [dragState, items, listId, onReorder, onMove, ariaLabel, onAnnounce, resetDragState],
   );

   const handleDragEnd = useCallback(() => {
      resetDragState();
   }, [resetDragState]);

   // Keyboard drag handlers
   const handleKeyboardGrab = useCallback(
      (id: string, index: number) => {
         dispatch({ type: "START_KEYBOARD_GRAB", id, index });

         const item = items[index];
         const itemTitle = (item as any).title || `Item ${index + 1}`;

         const hints: string[] = ["Use arrow keys to move"];
         if (index > 0) hints.push("Up to move up");
         if (index < items.length - 1) hints.push("Down to move down");
         if (adjacentLists?.left) hints.push("Left to move to previous column");
         if (adjacentLists?.right) hints.push("Right to move to next column");

         onAnnounce?.(
            `Grabbed "${itemTitle}". ${hints.join(
               ", ",
            )}. Enter or Space to drop, Escape to cancel.`,
         );
      },
      [items, adjacentLists, onAnnounce],
   );

   const handleKeyboardMove = useCallback(
      (id: string, index: number, direction: "up" | "down" | "left" | "right") => {
         const { grabbedItemIndex } = dragState;
         if (grabbedItemIndex === null) return;

         // Cross-column moves
         if (direction === "left" || direction === "right") {
            const targetList = direction === "left" ? adjacentLists?.left : adjacentLists?.right;
            if (targetList && onRequestMoveToList) {
               onRequestMoveToList(id, grabbedItemIndex, direction);
            } else {
               const directionName = direction === "left" ? "previous" : "next";
               onAnnounce?.(`No ${directionName} column available`);
            }
            return;
         }

         // Within-column moves
         let newIndex = grabbedItemIndex;
         if (direction === "up" && grabbedItemIndex > 0) {
            newIndex = grabbedItemIndex - 1;
         } else if (direction === "down" && grabbedItemIndex < items.length - 1) {
            newIndex = grabbedItemIndex + 1;
         } else {
            const boundary = direction === "up" ? "top" : "bottom";
            onAnnounce?.(`Already at ${boundary} of column`);
            return;
         }

         if (newIndex !== grabbedItemIndex) {
            onReorder(grabbedItemIndex, newIndex);
            dispatch({ type: "UPDATE_GRABBED_INDEX", index: newIndex });

            // Use newIndex for announcement (items not updated yet)
            const itemTitle =
               (items[grabbedItemIndex] as any).title || `Item ${grabbedItemIndex + 1}`;
            onAnnounce?.(`Moved "${itemTitle}" to position ${newIndex + 1}`);
         }
      },
      [
         dragState.grabbedItemIndex,
         items,
         onReorder,
         onAnnounce,
         adjacentLists,
         onRequestMoveToList,
      ],
   );

   const handleKeyboardDrop = useCallback(
      (id: string, index: number) => {
         const item = items[index];
         const itemTitle = (item as any).title || `Item ${index + 1}`;
         onAnnounce?.(`Dropped "${itemTitle}" at position ${index + 1} in ${ariaLabel || listId}`);
         dispatch({ type: "END_DRAG" });
      },
      [items, onAnnounce, ariaLabel, listId],
   );

   const handleKeyboardCancel = useCallback(
      (id: string, index: number) => {
         const { grabbedItemIndex } = dragState;
         if (grabbedItemIndex !== null && grabbedItemIndex !== index) {
            // Revert: swap back to original
            onReorder(grabbedItemIndex, index);
         }

         const origIndex = grabbedItemIndex ?? index;
         const item = items[origIndex];
         const itemTitle = (item as any)?.title || "Item";
         onAnnounce?.(`Cancelled. "${itemTitle}" returned to original position.`);

         dispatch({ type: "CANCEL_GRAB" });
      },
      [dragState.grabbedItemIndex, items, onReorder, onAnnounce],
   );

   // Render items
   const renderedItems = items.map((item, index) => {
      const isDragging =
         dragState.dragType === "mouse" &&
         dragState.draggedItemId === item.id &&
         dragState.draggedFromListId === listId;

      const isGrabbed =
         dragState.dragType === "keyboard" &&
         dragState.grabbedItemId === item.id &&
         dragState.grabbedFromListId === listId;

      return (
         <DraggableItem
            key={item.id}
            id={item.id}
            index={index}
            listId={listId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            isDragging={isDragging}
            isGrabbed={isGrabbed}
            onKeyboardGrab={() => handleKeyboardGrab(item.id, index)}
            onKeyboardMove={(dir) => handleKeyboardMove(item.id, index, dir)}
            onKeyboardDrop={() => handleKeyboardDrop(item.id, index)}
            onKeyboardCancel={() => handleKeyboardCancel(item.id, index)}
            ariaLabel={`${(item as any).title || `Item ${index + 1}`}, position ${index + 1} of ${
               items.length
            } in ${ariaLabel || listId}`}
         >
            {renderItem(item, index, isDragging, isGrabbed)}
         </DraggableItem>
      );
   });

   return (
      <>
         <DroppableZone
            listId={listId}
            onDrop={handleDrop}
            onDragOver={handleDragOverList}
            isOver={isOverList}
            ariaLabel={ariaLabel}
            className={cn(direction === "vertical" ? "flex flex-col" : "flex flex-row", className)}
         >
            {/* Hidden instructions for screen readers */}
            <div
               id="drag-instructions"
               className="sr-only"
            >
               Press Space or Enter to grab. Use arrow keys to move within and between columns.
               Press Space or Enter to drop. Press Escape to cancel.
            </div>

            {renderedItems}
         </DroppableZone>

         {draggedItemNode && (
            <DragOverlay isVisible={!!dragState.draggedItemId}>{draggedItemNode}</DragOverlay>
         )}
      </>
   );
}
