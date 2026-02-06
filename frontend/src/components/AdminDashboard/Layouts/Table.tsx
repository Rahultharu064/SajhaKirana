
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

type Props = {
  columns: string[];
  data: any[];
  actions?: (row: any) => React.ReactElement;
};

export default function Table({ columns, data, actions }: Props) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      // Handle different data types
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown size={14} className="text-slate-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp size={14} className="text-emerald-600" />
      : <ChevronDown size={14} className="text-emerald-600" />;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-lg bg-white dark:bg-slate-800">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/50">
        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <tr>
            {columns.map((col) => (
              <th 
                key={col} 
                className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group"
                onClick={() => handleSort(col)}
              >
                <div className="flex items-center gap-2">
                  <span>{col}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {getSortIcon(col)}
                  </span>
                </div>
              </th>
            ))}
            {actions && (
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {sortedData.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (actions ? 1 : 0)} 
                className="text-center py-12"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">No data available</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">There are no records to display at the moment.</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150 group"
              >
                {columns.map((col) => (
                  <td 
                    key={col} 
                    className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100"
                  >
                    {row[col]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
