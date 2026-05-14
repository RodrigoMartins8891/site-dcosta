import { ShoppingCart } from 'lucide-react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        {product.featured && (
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mb-2">
            Destaque
          </span>
        )}

        <h3 className="font-semibold text-gray-900 mb-1">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-700">
              R$ {Number(product.price).toFixed(2)}
            </span>

            <p className="text-xs text-gray-500 mt-1">
              {isOutOfStock
                ? 'Indisponível'
                : `${product.stock_quantity} em estoque`}
            </p>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            title={isOutOfStock ? 'Produto indisponível' : 'Adicionar ao carrinho'}
            className={`p-3 rounded-lg transition-colors ${
              !isOutOfStock
                ? 'bg-[#008233] hover:bg-[#006628] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}