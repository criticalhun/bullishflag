// src/components/DashboardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
  return (
    <>
      {/* Chart Skeleton */}
      <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md mb-8">
        <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-2 w-12 text-left"><Skeleton className="h-5 w-8" /></th>
                <th className="p-2 text-left"><Skeleton className="h-5 w-8" /></th>
                <th className="p-2 text-left"><Skeleton className="h-5 w-20" /></th>
                <th className="p-2 text-left"><Skeleton className="h-5 w-24" /></th>
                <th className="p-2 text-left"><Skeleton className="h-5 w-24" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <td className="p-2 text-center"><Skeleton className="h-6 w-6 rounded-full" /></td>
                  <td className="p-2"><Skeleton className="h-5 w-5" /></td>
                  <td className="p-2 font-semibold"><Skeleton className="h-5 w-32" /></td>
                  <td className="p-2"><Skeleton className="h-5 w-20" /></td>
                  <td className="p-2"><Skeleton className="h-5 w-20" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
