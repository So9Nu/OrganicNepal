import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <ShoppingBag size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="font-bold text-forest-800 text-lg">Your Cart</h2>
              <p className="text-xs text-forest-500">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="font-semibold text-forest-700 mb-2">Your cart is empty</h3>
              <p className="text-sm text-forest-500 mb-6">Add some fresh organic products!</p>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="btn-primary text-sm"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 p-4 glass-card rounded-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-forest-800 text-sm leading-tight">{item.name}</h4>
                      <p className="text-xs text-forest-500 mt-0.5">{item.unit}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 p-1 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-primary-700">रू {(item.price * item.quantity).toLocaleString()}</span>
                    <div className="flex items-center gap-2 bg-primary-50 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-primary-100 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-semibold text-forest-800 text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-primary-100 bg-cream-50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-forest-600">
                <span>Subtotal</span>
                <span>रू {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-forest-600">
                <span>Delivery</span>
                <span className="text-primary-600 font-medium">{totalPrice >= 1000 ? 'Free' : 'रू 80'}</span>
              </div>
              {totalPrice < 1000 && (
                <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
                  Add रू {(1000 - totalPrice).toLocaleString()} more for free delivery!
                </p>
              )}
              <div className="flex justify-between font-bold text-forest-800 text-lg pt-2 border-t border-primary-100">
                <span>Total</span>
                <span className="text-primary-700">रू {(totalPrice + (totalPrice >= 1000 ? 0 : 80)).toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
