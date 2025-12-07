import Table from '../Layouts/Table';
import { Edit, Trash } from 'lucide-react';

const sampleOrders = [
  { id: '001', customer: 'John Doe', status: 'Pending', total: '$100' },
  { id: '002', customer: 'Jane Smith', status: 'Shipped', total: '$150' },
];

function Orders() {
  return (
    <div>
      <Table
        columns={['ID', 'Customer', 'Status', 'Total']}
        data={sampleOrders}
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

export default Orders;
