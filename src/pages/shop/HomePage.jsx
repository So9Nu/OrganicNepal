import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Package, Truck, Shield, Star } from 'lucide-react';
import { products, stats, testimonials } from '../../data/mockData';
import ProductCard from '../../components/shop/ProductCard';
import Layout from '../../components/layout/Layout';

const features = [
  {
    icon: Leaf,
    title: '100% Organic',
    desc: 'Every product is certified organic, free from pesticides and chemicals.',
    color: 'bg-primary-100 text-primary-700',
  },
  {
    icon: Truck,
    title: 'Same-Day Delivery',
    desc: 'Order before 11 AM for same-day delivery within Kathmandu Valley.',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    icon: Package,
    title: 'Eco Packaging',
    desc: 'All orders packed in 100% biodegradable and compostable materials.',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: Shield,
    title: 'Farm Guaranteed',
    desc: 'Every product is traceable directly to the source farm.',
    color: 'bg-blue-100 text-blue-700',
  },
];

export default function HomePage() {
  const featured = products.filter(p => p.featured).slice(0, 4);

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-hero-pattern">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-400/15 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="text-white animate-fade-up">
              <div className="inline-flex items-center gap-2 glass text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                Nepal's #1 Organic Grocery Platform
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                From the
                <span className="block text-primary-300">Hills of Nepal</span>
                to Your Table
              </h1>

              <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-lg">
                Shop certified organic vegetables, fruits, dairy, and spices sourced directly from verified Nepali farms. Fresh today, delivered today.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary flex items-center gap-2 text-base py-3.5 px-8">
                  Shop Now
                  <ArrowRight size={18} />
                </Link>
                <Link to="/about" className="flex items-center gap-2 glass text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition-colors text-base">
                  Our Story
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-10">
                {[
                  { label: '12,000+ Happy Customers', icon: '😊' },
                  { label: '350+ Partner Farms', icon: '🏡' },
                  { label: '4.9★ Rating', icon: '⭐' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-white/80 text-sm">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image Card */}
            <div className="hidden lg:block animate-float">
              <div className="relative">
                <div className="glass rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/7129126/pexels-photo-7129126.jpeg"
                    alt="Fresh organic produce from Nepal"
                    className="w-full h-[480px] object-cover"
                  />
                </div>

                {/* Floating cards */}
                <div className="absolute -bottom-6 -left-6 glass-dark text-white p-4 rounded-2xl shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌿</span>
                    <div>
                      <p className="font-bold text-sm">100% Organics</p>
                      <p className="text-xs text-white/70">Certified & Verified</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 glass-dark text-white p-4 rounded-2xl shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚚</span>
                    <div>
                      <p className="font-bold text-sm">Same-Day Delivery</p>
                      <p className="text-xs text-white/70">Kathmandu Valley</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 fill-cream-50">
            <path d="M0,80 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 Z" />
          </svg>
        </div>
      </section>

      


    

     

      {/* ── CATEGORY GRID ── */}
     <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="section-title">
        Shop by <span className="text-primary-600">Category</span>
      </h2>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {[
        {
          image: "src/pages/shop/vegetables.avif",
          label: "Vegetables",
          cat: "vegetables",
          bg: "bg-green-01 hover:bg-green-100",
          color: "text-green-700",
        },
        {
          image: "src/pages/fruits.jpg",
          label: "Fruits",
          cat: "fruits",
          bg: "bg-red-01 hover:bg-red-100",
          color: "text-red-700",
        },
        {
          image: "src/pages/milks.jpg",
          label: "Dairy",
          cat: "dairy",
          bg: "bg-blue-01 hover:bg-blue-100",
          color: "text-blue-700",
        },
        {
          image: "src/pages/grains.jpg",
          label: "Grains",
          cat: "grains",
          bg: "bg-amber-01 hover:bg-amber-100",
          color: "text-amber-700",
        },
        {
          image: "src/pages/spices.jpg",
          label: "Spices",
          cat: "spices",
          bg: "bg-orange-01 hover:bg-orange-100",
          color: "text-orange-700",
        },
      ].map((c) => (
        <Link
          key={c.cat}
          to={`/shop?category=${c.cat}`}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl ${c.bg} ${c.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-card group`}
        >
          {/* FIXED IMAGE */}
          <div className="w-full h-32 mb-4 overflow-hidden rounded-xl">
            <img
              src={c.image}
              alt={c.label}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
            />
          </div>

          <span className="font-semibold text-sm text-center">
            {c.label}
          </span>
        </Link>
      ))}
    </div>
  </div>
</section>

  {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 bg-cream-50 bg-organic-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">Featured <span className="text-primary-600">Products</span></h2>
              <p className="section-subtitle">Handpicked organic goodness from our best farms</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-900 transition-colors"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/shop" className="btn-outline inline-flex items-center gap-2">
              Browse All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


 {/* ── FEATURES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Why Choose <span className="text-primary-600">Organic Nepal?</span></h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              We're building a healthier Nepal by connecting conscious consumers with dedicated organic farmers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="p-6 rounded-2xl border border-primary-100 hover:border-primary-300 hover:shadow-card transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color} group-hover:scale-110 transition-transform`}>
                  <feat.icon size={24} />
                </div>
                <h3 className="font-bold text-forest-800 mb-2">{feat.title}</h3>
                <p className="text-sm text-forest-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      

     

  {/* ── BANNER ── */}
      <section className="py-20 bg-hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="badge bg-white/20 text-white mb-4 text-sm">🌿 Supporting Local Farmers</span>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Every Purchase Supports a <span className="text-primary-300">Nepali Farm Family</span>
              </h2>
              <p className="text-white/75 leading-relaxed mb-6">
                We pay farmers 30% more than market rate and invest in sustainable agricultural practices. When you buy organic, you're empowering rural communities.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 glass text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition-colors">
                Learn Our Mission <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Avg. farmer income increase', value: '+30%', icon: '📈' },
                { label: 'Families supported', value: '1,200+', icon: '👨‍👩‍👧‍👦' },
                { label: 'kg of chemicals avoided', value: '2.4T', icon: '🌍' },
                { label: 'Organic land cultivated', value: '850 Ha', icon: '🌾' },
              ].map((item, i) => (
                <div key={i} className="glass rounded-2xl p-5 text-white text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-bold text-primary-300">{item.value}</div>
                  <div className="text-xs text-white/70 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

{/* ── STATS ── */}
            <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center hover:shadow-card-hover transition-shadow">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-primary-700">{stat.value}</div>
                <div className="text-sm text-forest-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>



{/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our <span className="text-primary-600">Customers Say</span></h2>
            <p className="section-subtitle">Real people. Real organic food. Real stories.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center text-white font-bold">
                    {t.image ? (<img src={t.image} alt={t.name} className="w-full h-full object-cover rounded-full" />) : (
                      t.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-forest-800">{t.name}</p>
                    <p className="text-xs text-forest-500"> {t.location}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-forest-700 leading-relaxed italic">"{t.comment}"</p>
                <p className="text-xs text-forest-400 mt-4">{t.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* ── CTA ── */}
    <section
  className="py-20 bg-cover bg-center relative"
  style={{
    backgroundImage: "url(https://images.pexels.com/photos/5136449/pexels-photo-5136449.jpeg?w=1600&q=80)",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-primary-700/60"></div>

  <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
    <h2 className="text-4xl font-bold mb-4">
      Ready to Go Organic?
    </h2>

    <p className="text-lg mb-8">
      Join 12,000+ Nepalis who've made the switch. Get 15% off your first order with code <strong>ORGANIC</strong>
    </p>

    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link to="/shop" className="bg-white text-primary-700 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition text-lg">
        Start Shopping
      </Link>

      <Link to="/signup" className="border-2 border-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition text-lg">
        Create Account
      </Link>
    </div>
  </div>
</section>


    </Layout>
  );
}
