import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const BADGE_STYLES = {
  organic: 'badge-organic',
  fresh: 'badge-fresh',
  sale: 'badge-sale',
  new: 'badge-new',
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card group relative">
      {/* Image */}
      <div className="relative overflow-hidden h-52 bg-cream-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-forest-800 text-sm font-bold px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick view button on hover */}
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="absolute bottom-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-50"
        >
          <Eye size={16} className="text-forest-700" />
        </button>

        {/* Farm badge */}
        <div className="absolute bottom-3 left-3 glass text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          📍 {product.location}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {(product.badges || []).slice(0, 2).map(badge => (
            <span key={badge} className={BADGE_STYLES[badge]}>
              {badge === 'organic' && '🌿 '}
              {badge === 'fresh' && '✨ '}
              {badge === 'sale' && '🏷️ '}
              {badge === 'new' && '⭐ '}
              {badge.charAt(0).toUpperCase() + badge.slice(1)}
            </span>
          ))}
        </div>

        {/* Name */}
        <h3
          onClick={() => navigate(`/product/${product.id}`)}
          className="font-bold text-forest-800 mb-0.5 cursor-pointer hover:text-primary-700 transition-colors leading-snug"
        >
          {product.name}
        </h3>
        <p className="text-xs text-forest-500 mb-3">{product.nepali} · {product.unit}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
              />
            ))}
          </div>
          <span className="text-xs text-forest-600 font-medium">{product.rating}</span>
          <span className="text-xs text-forest-400">({product.reviews})</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-primary-700 text-lg">रू {product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-forest-400 line-through ml-2">रू {product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
              product.inStock
                ? 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-glow hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
