import Layout from '../../components/layout/Layout';
import { Leaf, Heart, Users, Mountain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Sonu', role: 'Co-Founder & CEO', avatar: 'S', bio: 'Former agricultural scientist turned entrepreneur with a vision for organic Nepal.' },
  { name: 'Aryan', role: 'Head of Farmer Relations', avatar: 'A', bio: 'Works directly with 350+ farms to ensure quality and fair trade practices.' },
  { name: 'Ankit', role: 'Chief Technology Officer', avatar: 'A', bio: 'Building the tech backbone that connects farms to your table seamlessly.' },
];

const values = [
  { icon: Leaf, title: 'Organic First', desc: 'Every product meets strict organic certification standards. No exceptions.' },
  { icon: Heart, title: 'Community Love', desc: 'We reinvest 15% of revenue into farmer education and community development.' },
  { icon: Users, title: 'Fair Trade', desc: 'Farmers earn 30% above market rate. Your purchase makes a real difference.' },
  { icon: Mountain, title: 'Nepal Proud', desc: "Homegrown, Himalayan, and here to stay. Supporting our nation's farmers." },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <div className="bg-hero-pattern py-24 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <span className="badge bg-white/20 text-white mb-4 text-sm">🌱 Our Story</span>
          <h1 className="text-5xl font-bold mb-6">Growing Nepal, <span className="text-primary-300">One Harvest</span> at a Time</h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Organic Nepal was born from a simple belief: that people deserve access to food that is grown with care, honesty, and respect for the land.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title mb-4">How It All <span className="text-gradient">Started</span></h2>
              <p className="text-forest-600 leading-relaxed mb-4">
                In 2021, two friends — Anita and Bikash — noticed a growing disconnect between Nepali farmers and urban consumers. Farmers were struggling to earn fair prices while city dwellers couldn't find authentic organic produce.
              </p>
              <p className="text-forest-600 leading-relaxed mb-6">
                They set out to build a transparent supply chain — eliminating middlemen and creating direct connections between 350+ farms and 12,000+ families across Nepal.
              </p>
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                Shop Our Products <ArrowRight size={18} />
              </Link>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-card">
              <img
                src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80"
                
                alt="Nepali farmers in the field"
                className="w-full h-80 object-cover"
              />
                <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                
                alt="Nepali farmers in the field"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our <span className="text-gradient">Values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center hover:shadow-card-hover transition-shadow">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon size={26} className="text-primary-700" />
                </div>
                <h3 className="font-bold text-forest-800 mb-2">{v.title}</h3>
                <p className="text-sm text-forest-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet the <span className="text-gradient">Team</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="glass-card rounded-2xl p-8 text-center hover:shadow-card-hover transition-shadow">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-bold text-forest-800 text-lg">{member.name}</h3>
                <p className="text-primary-600 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-sm text-forest-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
