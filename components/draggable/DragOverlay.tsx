// src/components/draggable/DragOverlay.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DragOverlayProps {
   children: React.ReactNode;
   isVisible: boolean;
}

export function DragOverlay({ children, isVisible }: DragOverlayProps) {
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
   }, []);

   if (!mounted || !isVisible) return null;

   return createPortal(
      <div
         className="fixed inset-0 pointer-events-none z-50"
         aria-hidden="true"
      >
         <div className="absolute top-0 left-0 opacity-80 transform rotate-3 scale-105">
            {children}
         </div>
      </div>,
      document.body,
   );
}
