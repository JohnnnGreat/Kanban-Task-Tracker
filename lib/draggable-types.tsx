// src/lib/draggable-types.ts

export interface DraggableItemData {
   id: string;
   [key: string]: any;
}

export interface DragState {
   isDragging: boolean;
   draggedItemId: string | null;
   draggedFromListId: string | null;
   draggedOverListId: string | null;
   draggedOverIndex: number | null;
   dragType: "mouse" | "keyboard" | null;
}

export interface DraggableListProps<T extends DraggableItemData> {
   items: T[];
   renderItem: (item: T, index: number, isDragging: boolean, isGrabbed: boolean) => React.ReactNode;
   onReorder: (fromIndex: number, toIndex: number) => void;
   onMove?: (itemId: string, toListId: string, toIndex: number) => void;
   listId: string;
   direction?: "vertical" | "horizontal";
   className?: string;
   ariaLabel?: string;
}

export interface DraggableItemProps {
   id: string;
   index: number;
   listId: string;
   children: React.ReactNode;
   onDragStart: (id: string, index: number, listId: string) => void;
   onDragEnd: () => void;
   onDragOver: (index: number) => void;
   isDragging: boolean;
   isGrabbed: boolean;
   onKeyboardGrab: () => void;
   onKeyboardMove: (direction: "up" | "down" | "left" | "right") => void;
   onKeyboardDrop: () => void;
   onKeyboardCancel: () => void;
   ariaLabel?: string;
}

export interface DroppableZoneProps {
   listId: string;
   onDrop: (listId: string) => void;
   isOver: boolean;
   children: React.ReactNode;
   className?: string;
   ariaLabel?: string;
}
