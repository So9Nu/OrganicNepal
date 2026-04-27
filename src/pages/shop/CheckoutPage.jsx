import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Leaf } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Kathmandu',
    district: 'Kathmandu',
    notes: '',
    payment: 'khalti',
  });

  const delivery = totalPrice >= 1000 ? 0 : 80;
  const total = totalPrice + delivery;

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // ✅ Save order to localStorage
    const orderId = `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: total,
      status: 'Processing',
      deliveryInfo: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        notes: form.notes,
      },
      paymentMethod: form.payment,
    };

    // Store order per user ID
    if (user) {
      const userId = user.id || user.phone || user.phoneNumber;
      const existingOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
      existingOrders.push(newOrder);
      localStorage.setItem(`orders_${userId}`, JSON.stringify(existingOrders));
    }

    // Update user profile with latest address
    if (user) {
      const userId = user.id || user.phone || user.phoneNumber;
      localStorage.setItem(`profile_${userId}`, JSON.stringify({
        name: form.name,
        phone: form.phone,
        address: form.address,
      }));
    }
    
    setOrderPlaced(true);
    clearCart();
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-forest-800 mb-4">Your cart is empty</h2>
            <Link to="/shop" className="btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (orderPlaced) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
              <Check size={40} className="text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-forest-800 mb-3">Order Placed! 🎉</h2>
            <p className="text-forest-600 mb-2">Thank you, <strong>{form.name}</strong>!</p>
            <p className="text-forest-500 text-sm mb-8">Your organic groceries are being prepared. We'll send a confirmation to <strong>{form.email}</strong>.</p>
            <div className="glass-card rounded-2xl p-5 mb-6 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-forest-600">Order ID</span>
                <span className="font-bold text-forest-800">#ORG-{Math.random().toString(36).slice(2, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-forest-600">Amount Paid</span>
                <span className="font-bold text-primary-700">रू {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-forest-600">Estimated Delivery</span>
                <span className="font-bold text-forest-800">Today, 5–7 PM</span>
              </div>
            </div>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              Back to Home <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-forest-800 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10">
          {['Delivery', 'Payment', 'Review'].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step > i + 1 ? 'bg-primary-600 text-white' :
                  step === i + 1 ? 'bg-primary-600 text-white' :
                    'bg-primary-100 text-primary-400'
                }`}>
                {step > i + 1 ? <Check size={16} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-primary-700' : 'text-forest-400'}`}>{s}</span>
              {i < 2 && <div className={`h-0.5 flex-1 ${step > i + 1 ? 'bg-primary-400' : 'bg-primary-100'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Delivery */}
              {step === 1 && (
                <div className="glass-card rounded-2xl p-6 animate-fade-in">
                  <h2 className="font-bold text-forest-800 text-xl mb-6">Delivery Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-1.5">Full Name</label>
                      <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-1.5">Phone</label>
                      <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="+977 98XXXXXXXX" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-forest-700 mb-1.5">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="email@example.com" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-forest-700 mb-1.5">Delivery Address</label>
                      <input name="address" value={form.address} onChange={handleChange} required className="input-field" placeholder="Street address, landmark..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-1.5">City / Area</label>
                      <select name="city" value={form.city} onChange={handleChange} className="input-field">
                        {['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan'].map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-1.5">Order Notes (optional)</label>
                      <input name="notes" value={form.notes} onChange={handleChange} className="input-field" placeholder="Special instructions..." />
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="btn-primary mt-6 flex items-center gap-2">
                    Continue to Payment <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="glass-card rounded-2xl p-6 animate-fade-in">
                  <h2 className="font-bold text-forest-800 text-xl mb-6">Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'khalti', label: 'Khalti Digital Wallet', icon: '💜', desc: 'Pay securely with Khalti' },
                      { id: 'esewa', label: 'eSewa', icon: '💚', desc: 'Pay with eSewa wallet' },
                      { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                    ].map(pm => (
                      <label key={pm.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.payment === pm.id ? 'border-primary-500 bg-primary-50' : 'border-primary-100 hover:border-primary-200'
                        }`}>
                        <input type="radio" name="payment" value={pm.id} checked={form.payment === pm.id} onChange={handleChange} className="sr-only" />
                        <span className="text-2xl">{pm.icon}</span>
                        <div>
                          <p className="font-semibold text-forest-800">{pm.label}</p>
                          <p className="text-xs text-forest-500">{pm.desc}</p>
                        </div>
                        {form.payment === pm.id && (
                          <div className="ml-auto w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      Review Order <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="glass-card rounded-2xl p-6 animate-fade-in">
                  <h2 className="font-bold text-forest-800 text-xl mb-6">Review Your Order</h2>
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-primary-50 rounded-xl">
                      <p className="text-xs font-bold text-primary-700 uppercase mb-2">Delivery To</p>
                      <p className="font-semibold text-forest-800">{form.name}</p>
                      <p className="text-sm text-forest-600">{form.address}, {form.city}</p>
                      <p className="text-sm text-forest-600">{form.phone}</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-xl">
                      <p className="text-xs font-bold text-primary-700 uppercase mb-2">Payment</p>
                      <p className="font-semibold text-forest-800 capitalize">{form.payment === 'cod' ? 'Cash on Delivery' : form.payment}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
                    <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                      <Leaf size={16} /> Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="glass-card rounded-2xl p-5 sticky top-24">
                <h3 className="font-bold text-forest-800 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto no-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-forest-800 truncate">{item.name}</p>
                        <p className="text-xs text-forest-500">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-primary-700 flex-shrink-0">रू {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-primary-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-forest-600">
                    <span>Subtotal</span><span>रू {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-forest-600">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-primary-600 font-medium' : ''}>{delivery === 0 ? 'Free' : `रू ${delivery}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-forest-800 text-lg border-t border-primary-100 pt-2">
                    <span>Total</span><span className="text-primary-700">रू {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
