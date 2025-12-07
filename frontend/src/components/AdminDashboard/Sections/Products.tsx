import Table from '../Layouts/Table';
import { Edit, Trash } from 'lucide-react';

const sampleProducts = [
  { name: 'Product 1', price: '$10', category: 'Category 1' },
  { name: 'Product 2', price: '$20', category: 'Category 2' },
];

function Products() {
  return (
    <div>
      <Table
        columns={['Name', 'Price', 'Category']}
        data={sampleProducts}
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

export default Products;
