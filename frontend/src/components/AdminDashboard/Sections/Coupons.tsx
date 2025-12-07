import Table from '../Layouts/Table';
import { Edit, Trash } from 'lucide-react';

const sampleCoupons = [
  { code: 'DISCOUNT10', discount: '10%', expiry: '2023-12-31' },
  { code: 'SAVE20', discount: '20%', expiry: '2023-12-31' },
];

function Coupons() {
  return (
    <div>
      <Table
        columns={['Code', 'Discount', 'Expiry']}
        data={sampleCoupons}
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

export default Coupons;
