import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, Leaf, Plus, Minus, Heart, Share2, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/shop/ProductCard';

const PRODUCTS_API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5008/api'}/products`;
const asBoolean = (value) => value === true || value === 1 || value === '1' || value === 'true';
const normalizeProduct = (product) => ({
  ...product,
  price: Number(product.price), originalPrice: product.originalPrice == null ? null : Number(product.originalPrice),
  rating: Number(product.rating) || 0, reviews: Number(product.reviews) || 0,
  inStock: asBoolean(product.inStock), featured: asBoolean(product.featured),
  badges: product.badges || [product.featured && 'organic', product.inStock && 'fresh'].filter(Boolean),
  nepali: product.nepali || '', description: product.description || '',
});

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${PRODUCTS_API_URL}/${encodeURIComponent(id)}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch product');

        const apiProduct = data.product || data;
        if (!apiProduct || typeof apiProduct !== 'object') throw new Error('The products API returned an invalid response');
        const normalized = normalizeProduct(apiProduct);
        setProduct(normalized);
        const relatedResponse = await fetch(`${PRODUCTS_API_URL}?category=${encodeURIComponent(normalized.category)}`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          const relatedProducts = Array.isArray(relatedData) ? relatedData : relatedData.products;
          setRelated(Array.isArray(relatedProducts) ? relatedProducts.map(normalizeProduct).filter(item => item.id !== normalized.id).slice(0, 3) : []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Layout><p>Loading product...</p></Layout>;
  if (error) return <Layout><p>Error: {error}</p></Layout>;
  if (!product) return <Layout><p>Product not found.</p></Layout>;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-forest-500 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-600">Shop</Link>
          <span>/</span>
          <span className="text-forest-800 font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-14 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-cream-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {discount > 0 && (
              <div className="absolute top-5 left-5 bg-orange-500 text-white font-bold px-3 py-1.5 rounded-full text-sm">
                -{discount}% OFF
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/30 rounded-3xl flex items-center justify-center">
                <span className="bg-white text-forest-800 font-bold text-lg px-6 py-3 rounded-full">Out of Stock</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-5 right-5 flex flex-col gap-2">
              <button className="w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center hover:bg-red-50 transition-colors group">
                <Heart size={18} className="text-gray-400 group-hover:text-red-500" />
              </button>
              <button className="w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center hover:bg-primary-50 transition-colors">
                <Share2 size={18} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-forest-500 hover:text-primary-600 mb-4 transition-colors">
              <ArrowLeft size={16} /> Back
            </button>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.badges.map(badge => (
                <span key={badge} className={`badge ${badge === 'organic' ? 'badge-organic' :
                    badge === 'fresh' ? 'badge-fresh' :
                      badge === 'sale' ? 'badge-sale' : 'badge-new'
                  } capitalize`}>{badge}</span>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-forest-800 mb-1">{product.name}</h1>
            <p className="text-forest-500 text-lg mb-2">{product.nepali}</p>

            {/* Farm info */}
            <div className="flex items-center gap-2 text-sm text-forest-600 mb-6">
              <MapPin size={14} className="text-primary-500" />
              <span>From <strong className="text-forest-800">{product.farm}</strong>, {product.location}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="font-bold text-forest-800">{product.rating}</span>
              <span className="text-forest-500 text-sm">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-bold text-primary-700">रू {product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-forest-400 line-through">रू {product.originalPrice}</span>
              )}
              <span className="text-sm text-forest-500">/ {product.unit}</span>
            </div>

            {/* Quantity & Add to Cart */}
            {product.inStock ? (
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-3 border border-primary-200 rounded-full px-4 py-2 bg-white">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center hover:bg-primary-100 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-forest-800 w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>

                <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5">
                  <ShoppingCart size={18} />
                  Add to Cart · रू {(product.price * quantity).toLocaleString()}
                </button>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">
                This product is currently out of stock. Check back soon!
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Leaf, text: 'Certified Organic', color: 'text-primary-700 bg-primary-50' },
                { icon: Truck, text: 'Fast Delivery', color: 'text-orange-700 bg-orange-50' },
                { icon: Shield, text: 'Quality Assured', color: 'text-blue-700 bg-blue-50' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center ${color}`}>
                  <Icon size={20} />
                  <span className="text-xs font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-1 border-b border-primary-100 mb-6">
            {['description', 'nutrition', 'farm'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${activeTab === tab
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-forest-500 hover:text-forest-800'
                  }`}
              >
                {tab === 'description' ? 'Description' : tab === 'nutrition' ? 'Nutrition' : 'About The Farm'}
              </button>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6 text-forest-700 leading-relaxed text-sm">
            {activeTab === 'description' && (
              <div>
                <p className="text-base">{product.description}</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2">✅ Grown without synthetic pesticides or fertilizers</li>
                  <li className="flex items-center gap-2">✅ Hand-picked and quality checked at source</li>
                  <li className="flex items-center gap-2">✅ Delivered within 24 hours of harvest</li>
                  <li className="flex items-center gap-2">✅ Packed in eco-friendly biodegradable materials</li>
                </ul>
              </div>
            )}
            {activeTab === 'nutrition' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Calories', value: '25 kcal' },
                  { label: 'Protein', value: '2.9g' },
                  { label: 'Carbohydrates', value: '3.6g' },
                  { label: 'Fiber', value: '2.2g' },
                  { label: 'Fat', value: '0.4g' },
                  { label: 'Vitamin C', value: '28mg' },
                ].map(n => (
                  <div key={n.label} className="flex justify-between py-2 border-b border-primary-50">
                    <span className="text-forest-600">{n.label}</span>
                    <span className="font-semibold text-forest-800">{n.value}</span>
                  </div>
                ))}
                <p className="text-xs text-forest-400 col-span-2">*Per 100g serving. Nutritional values are approximate.</p>
              </div>
            )}
            {activeTab === 'farm' && (
              <div>
                <h3 className="font-bold text-forest-800 text-lg mb-2">{product.farm}</h3>
                <p className="flex items-center gap-2 text-primary-600 mb-4"><MapPin size={14} />{product.location}, Nepal</p>
                <p>Our partner farm practices traditional organic farming methods passed down through generations. They use natural composting, crop rotation, and rainwater harvesting to maintain soil health without compromising on yield quality.</p>
                <p className="mt-3">By buying from {product.farm}, you're directly supporting the livelihood of dedicated farming families and promoting sustainable land practices in Nepal.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-8">Related <span className="text-gradient">Products</span></h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
