// src/components/LiveRegion.tsx
"use client";

import React, { useEffect, useState } from "react";

interface LiveRegionProps {
   message: string;
   clearDelay?: number;
}

export function LiveRegion({ message, clearDelay = 3000 }: LiveRegionProps) {
   const [announcement, setAnnouncement] = useState("");

   useEffect(() => {
      if (message) {
         setAnnouncement(message);

         // Clear the message after delay to allow new announcements
         const timer = setTimeout(() => {
            setAnnouncement("");
         }, clearDelay);

         return () => clearTimeout(timer);
      }
   }, [message, clearDelay]);

   return (
      <div
         role="status"
         aria-live="polite"
         aria-atomic="true"
         className="sr-only"
      >
         {announcement}
      </div>
   );
}
