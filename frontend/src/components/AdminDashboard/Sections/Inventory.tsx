import Table from '../Layouts/Table';
import { Edit, Trash } from 'lucide-react';

const sampleInventory = [
  { name: 'Item 1', quantity: 50, location: 'Warehouse A' },
  { name: 'Item 2', quantity: 30, location: 'Warehouse B' },
];

function Inventory() {
  return (
    <div>
      <Table
        columns={['Name', 'Quantity', 'Location']}
        data={sampleInventory}
        actions={(_row) => (
          <div className="flex gap-2">
            <button type="button" aria-label="Edit" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <Edit size={16} />
            </button>
            <button type="button" aria-label="Delete" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500">
              <Trash size={16} />
            </button>
          </div>
        )}
      />
    </div>
  );
}

export default Inventory;
