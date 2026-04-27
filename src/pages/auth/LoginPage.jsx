import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, Lock, Mail, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage({ adminRoute = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Email Validation
  const validateEmail = (emailValue) => {
    if (!emailValue) return { valid: false, message: '' };
    if (!emailValue.includes('@')) return { valid: false, message: 'Email must contain @' };
    if (!emailValue.endsWith('@gmail.com')) return { valid: false, message: 'Only @gmail.com addresses are accepted' };
    return { valid: true, message: '' };
  };

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

  const emailValidation = validateEmail(email);
  const passwordRequirements = validatePassword(password);
  const allPasswordsMet = Object.values(passwordRequirements).every(v => v);
  const isFormValid = emailValidation.valid && allPasswordsMet && (!adminRoute && phone ? true : adminRoute);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate network
    const result = login(email, password, adminRoute, { phone });
    setLoading(false);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : '/');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    
    <div className="min-h-screen flex">
      {/* Left: Visual Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-hero-pattern p-12 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-orange-400/15 rounded-full blur-3xl animate-pulse-slow" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Leaf size={22} className="text-white" />
          </div>
           <img src="https://unsplash.com/photos/a-man-carrying-a-basket-on-his-head-sf6xU4RKv0M" alt="" />
          <span className="font-bold text-white text-xl">Organic Nepal</span>
          
        </Link>

        <div className="relative z-10">
          <blockquote className="text-white">
            <p className="text-3xl font-bold leading-tight mb-4">
              "Fresh organic food<br />directly from Nepal's<br />finest farms"
            </p>
            <div className="flex items-center gap-3">
              <div className=""></div>
              <div>
              
               
              </div>
            </div>
          </blockquote>
        </div>

        <div className="flex gap-4 relative z-10">
          {[
            { value: '12K+', label: 'Customers' },
            { value: '350+', label: 'Farms' },
            { value: '4.9★', label: 'Rating' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-white text-center">
              <p className="font-bold text-lg">{s.value}</p>
              <p className="text-xs text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-cream-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-forest-800">Organic Nepal</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-forest-800 mb-2">
              {adminRoute ? 'Hello Malik 👋' : 'Welcome back 👋'}
            </h1>
            <p className="text-forest-500">Sign in to your Organic Nepal account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`input-field pl-11 ${email && (emailValidation.valid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500')}`}
                  placeholder="you@gmail.com"
                />
                {email && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {emailValidation.valid ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <AlertCircle size={18} className="text-red-600" />
                    )}
                  </div>
                )}
              </div>
              {email && !emailValidation.valid && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} /> {emailValidation.message}
                </p>
              )}
              {email && emailValidation.valid && (
                <p className="mt-1.5 text-sm text-green-600 flex items-center gap-1">
                  <Check size={14} /> Valid Gmail address
                </p>
              )}
            </div>

            {/* Phone Field */}
            {!adminRoute && (
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input-field pl-11"
                    placeholder="+977-98XXXXXXXX"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`input-field pl-11 pr-11 ${password && (allPasswordsMet ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500')}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password && (
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

            <div className="flex justify-end">
              <a href="#" className="text-sm text-primary-600 hover:underline">Forgot password?</a>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base transition ${
                !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                adminRoute ? '🔐 Admin' : '🌿 Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-forest-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
