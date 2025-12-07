
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
              <th key={col} className="text-left p-2">{col}</th>
            ))}
            {actions && <th className="p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              {columns.map((col) => (
                <td key={col} className="p-2">{row[col.toLowerCase()]}</td>
              ))}
              {actions && <td className="p-2">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
