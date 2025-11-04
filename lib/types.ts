// src/lib/types.ts

export type Priority = "low" | "medium" | "high";

export interface Avatar {
   id: string;
   name: string;
   color: string;
   initial: string;
}

export interface Card {
   id: string;
   title: string;
   description?: string;
   status: string;
   priority: Priority;
   estimatedHours: number;
   loggedHours: number;
   assignee?: string;
   dueDate: string;
   columnId: string;
   order: number;
   comments: number;
   tags: string[];
   avatars: Avatar[];
   createdAt: Date;
   updatedAt: Date;
}

export interface Column {
   id: string;
   title: string;
   order: number;
   cards: Card[];
}

export interface Board {
   id: string;
   title: string;
   columns: Column[];
}

export interface DragState {
   isDragging: boolean;
   draggedItem: Card | null;
   sourceColumnId: string | null;
   destinationColumnId: string | null;
}

// Generic drag-and-drop types
export interface DraggableListProps<T> {
   items: T[];
   renderItem: (item: T, index: number) => React.ReactNode;
   onReorder: (startIndex: number, endIndex: number) => void;
   onMove?: (itemId: string, fromList: string, toList: string, index: number) => void;
   listId: string;
   direction?: "vertical" | "horizontal";
}
