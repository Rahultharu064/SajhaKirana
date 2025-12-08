
import React from 'react';

type Props = {
  columns: string[];
  data: any[];
  actions?: (row: any) => React.ReactElement;
};

export default function Table({ columns, data, actions }: Props) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-left p-2 text-gray-900 dark:text-gray-100">{col}</th>
            ))}
            {actions && <th className="p-2 text-gray-900 dark:text-gray-100">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-gray-500 dark:text-gray-400">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                {columns.map((col) => (
                  <td key={col} className="p-2 text-gray-900 dark:text-gray-100">{row[col]}</td>
                ))}
                {actions && <td className="p-2">{actions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
