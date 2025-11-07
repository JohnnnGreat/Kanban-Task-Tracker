import React from "react";
import { cn } from "@/lib/utils";

/**
 * Component for breadcrumb navigation, page title, and tab navigation.
 * Presentational only; no state or handlers.
 */
export function BreadcrumbTabs() {
   const tabs = [
      "Timesheets",
      "Task Tracker",
      "Leave / Absence",
      "Payroll",
      "People Master Data",
      "Performance & Training",
      "HR Analytics",
   ];

   return (
      <div className="px-6 py-6">
         <div className="text-sm text-gray-500 mb-2">
            Dashboard &gt; Human Resource &gt; Task Tracker
         </div>
         <h1 className="text-3xl font-serif mb-6">Task Tracker</h1>

         {/* Tabs */}
         <div className="flex gap-6 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
               <button
                  key={tab}
                  className={cn(
                     "pb-3 text-sm cursor-pointer font-medium transition-colors",
                     tab === "Task Tracker"
                        ? "text-gray-900 border-b-2 border-gray-900"
                        : "text-gray-300",
                  )}
               >
                  {tab}
               </button>
            ))}
         </div>
      </div>
   );
}
