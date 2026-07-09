import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, Lock, Mail, User, Phone, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // ✅ Password Validation
  const validatePassword = (passwordValue) => {
    const requirements = {
      length: passwordValue.length >= 8,
      uppercase: /[A-Z]/.test(passwordValue),
      lowercase: /[a-z]/.test(passwordValue),
      digit: /[0-9]/.test(passwordValue),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue),
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(form.password);
  const allPasswordsMet = Object.values(passwordRequirements).every(v => v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!allPasswordsMet) {
      setError('Password does not meet all requirements.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = await signup(form.email, form.password, '', '', form.phone, form.name);
    setLoading(false);
    if (result.success) {
      setError('');
      navigate('/auth/login');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/36517204/pexels-photo-36517204.jpeg"
          alt="Fresh organic produce"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <Link to="/" className="flex items-center gap-2 relative z-10 p-12">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Leaf size={22} className="text-white" />
          </div>
          <span className="font-bold text-white text-xl">Organic Nepal</span>
        </Link>

        <div className="relative z-10 p-12">
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Join 12,000+<br />health-conscious<br />Nepalis 🌿
          </h2>
          <ul className="space-y-3">
            {[
              '✅ Get 15% off your first order',
              '✅ Access to exclusive farm deals',
              '✅ Free delivery on orders above रू 1000',
              '✅ Weekly organic produce boxes',
            ].map(item => (
              <li key={item} className="text-white/80 text-sm">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream-50">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-forest-800">Organic Nepal</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-forest-800 mb-2">Create Account 🌱</h1>
            <p className="text-forest-500">Start your organic journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
                <input name="name" value={form.name} onChange={handleChange} required className="input-field pl-11" placeholder="Your full name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field pl-11" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
                <input name="phone" value={form.phone} onChange={handleChange} required className="input-field pl-11" placeholder="+977 98XXXXXXXX" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required className="input-field pl-11 pr-11" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {form.password && (
              <div className="ml-4 mt-2">
                <p className="text-xs font-semibold text-forest-700 uppercase tracking-wide mb-2">
                  Password requirements
                </p>
                <ul className="space-y-1">
                  {[
                    { key: 'length',    label: 'At least 8 characters',      met: passwordRequirements.length },
                    { key: 'uppercase', label: 'Uppercase letter (A–Z)',      met: passwordRequirements.uppercase },
                    { key: 'lowercase', label: 'Lowercase letter (a–z)',      met: passwordRequirements.lowercase },
                    { key: 'digit',     label: 'Digit (0–9)',                 met: passwordRequirements.digit },
                    { key: 'special',   label: 'Special character (!@#$…)',   met: passwordRequirements.special },
                  ].map(({ key, label, met }) => (
                    <li key={key} className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-red-500'}`}>
                      {met ? <Check size={14} /> : <AlertCircle size={14} />}
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required className="input-field pl-11" placeholder="Repeat password" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
            )}

            <button type="submit" disabled={loading || !form.name || !form.email || !form.phone || !allPasswordsMet || form.password !== form.confirm} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🌿 Create Account'}
            </button>

            <p className="text-xs text-center text-forest-400">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
            </p>
          </form>

          <p className="text-center text-sm text-forest-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
