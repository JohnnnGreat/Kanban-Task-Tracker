import React from "react";

/**
 * Stats cards component displaying key metrics like open tasks, overdue, and completed.
 * Receives stats as props; presentational.
 */
interface StatsCardsProps {
   openToday: number;
   overdue: number;
   doneThisWeek: number;
}

export function StatsCards({ openToday, overdue, doneThisWeek }: StatsCardsProps) {
   return (
      <div className="grid grid-cols-3 gap-4 mb-8 px-6">
         <div className="bg-accent p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Open today</div>
            <div className="text-4xl font-bold font-romie mb-2">{openToday}</div>
            <div className="text-xs text-gray-500">
               What needs attention before close of business
            </div>
         </div>
         <div className="bg-accent p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Overdue</div>
            <div className="text-4xl font-bold font-romie mb-2">{overdue}</div>
            <div className="text-xs text-gray-500">Blockers that risk project timeline</div>
         </div>
         <div className="bg-accent p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Done this week</div>
            <div className="text-4xl font-bold font-romie mb-2">{doneThisWeek}</div>
            <div className="text-xs text-gray-500">Velocity metric for sprint health</div>
         </div>
      </div>
   );
}
