import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { 
  Package, 
  Building2, 
  Users2, 
  Recycle, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  Laptop, 
  Smartphone, 
  Leaf,
  Search
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#166534] text-xs font-semibold uppercase tracking-wider">
                <Leaf size={14} className="stroke-[2.5]" />
                Scan. Track. Recycle.
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
                Track E-Waste <br />
                For a <span className="text-[#166534]">Cleaner Tomorrow</span>
              </h1>

              <p className="text-lg text-[#64748B] max-w-xl leading-relaxed">
                A smart and transparent way to track electronic waste from collection to recycling using QR codes.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-medium text-base shadow-sm transition-all flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/track"
                  className="px-6 py-3 rounded-lg bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] font-medium text-base transition-all flex items-center gap-2"
                >
                  <Search size={18} className="text-[#166534]" />
                  Track
                </Link>
              </div>
            </div>

            {/* Right Visual Image (High-Tech E-Waste Circular Economy Visual) */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-4/3 rounded-2xl bg-white p-2.5 flex items-center justify-center border border-[#E2E8F0] shadow-lg overflow-hidden group">
                <img
                  src="/images/hero-visual.jpg"
                  alt="EcoTrack E-Waste Circular Economy Platform"
                  className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl text-white text-xs border border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-semibold">Live Traceability Active</span>
                  </div>
                  <span className="text-[11px] text-emerald-300 font-mono font-medium">QR Powered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Row (exact 4 metrics from mockup) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                <Package size={24} />
              </div>
              <div>
                <div className="text-lg font-bold text-[#0F172A] tracking-tight">Unique IDs</div>
                <div className="text-xs text-[#64748B] font-medium">Per registered item</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <div>
                <div className="text-lg font-bold text-[#0F172A] tracking-tight">QR Access</div>
                <div className="text-xs text-[#64748B] font-medium">Quick public tracking</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                <Users2 size={24} />
              </div>
              <div>
                <div className="text-lg font-bold text-[#0F172A] tracking-tight">Lifecycle</div>
                <div className="text-xs text-[#64748B] font-medium">Recorded status history</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                <Recycle size={24} />
              </div>
              <div>
                <div className="text-lg font-bold text-[#0F172A] tracking-tight">Two Paths</div>
                <div className="text-xs text-[#64748B] font-medium">Refurbish or recycle</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">How EcoTrack Works</h2>
          <p className="text-sm text-[#64748B] mt-2 max-w-xl mx-auto">
            Three simple steps ensuring full accountability and verifiable circular disposal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src="/images/step1-register.jpg"
                  alt="Register and tag e-waste device"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="w-9 h-9 rounded-lg bg-[#166534] text-white flex items-center justify-center font-bold text-sm mb-3">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Register & Tag</h3>
                <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                  Declare your old laptops, phones, or appliances and generate a unique QR code sticker for physical custody.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src="/images/step2-transit.jpg"
                  alt="Track custody with logistics scanning"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="w-9 h-9 rounded-lg bg-[#166534] text-white flex items-center justify-center font-bold text-sm mb-3">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Track Custody</h3>
                <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                  Collection centers and transporters scan the QR code to verify physical handoffs at every checkpoint.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src="/images/step3-recycling.jpg"
                  alt="Certified sustainable recycling laboratory"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="w-9 h-9 rounded-lg bg-[#166534] text-white flex items-center justify-center font-bold text-sm mb-3">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Certified Recycling</h3>
                <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                  Technicians inspect and route equipment for certified refurbishment or closed-loop material reclamation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="impact" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
              <QrCode size={28} className="text-[#166534] mb-3" />
              <h4 className="font-bold text-[#0F172A]">QR Code Tracking</h4>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Unique item-level identifiers provide tamper-proof physical-to-digital twin tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
              <Clock size={28} className="text-[#166534] mb-3" />
              <h4 className="font-bold text-[#0F172A]">Transparent Lifecycle</h4>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Follow your device's exact journey with timestamped checkpoints and location verification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
              <ShieldCheck size={28} className="text-[#166534] mb-3" />
              <h4 className="font-bold text-[#0F172A]">Responsible Recycling</h4>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Formal certification ensuring zero informal dumping and maximum precious metal recovery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
              <Recycle size={28} className="text-[#166534] mb-3" />
              <h4 className="font-bold text-[#0F172A]">Digital History</h4>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Open public passport allowing anyone to audit recycling outcomes without compromising user privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="mt-auto bg-[#0F172A] text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center text-white">
              <Leaf size={16} />
            </div>
            <span className="text-lg font-bold text-white">EcoTrack</span>
          </div>

          <div className="text-xs text-slate-500">
            © 2025 EcoTrack — Smart E-Waste Traceability System. Scan. Track. Recycle.
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
