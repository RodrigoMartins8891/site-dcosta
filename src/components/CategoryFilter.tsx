import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-3">Categorias</h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-[#008233] text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Todas as Peças
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-[#008233] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
