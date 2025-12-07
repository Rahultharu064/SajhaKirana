import Table from '../Layouts/Table';
import { Edit, Trash } from 'lucide-react';

const samplePromotions = [
  { name: 'Flash Sale', type: 'Sale', status: 'Active' },
  { name: 'New Year Promo', type: 'Discount', status: 'Inactive' },
];

function Promotions() {
  return (
    <div>
      <Table
        columns={['Name', 'Type', 'Status']}
        data={samplePromotions}
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

export default Promotions;
