import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

// Data arrays (unchanged)
const collections = [
  { cat: "New Season", name: "Noir Signature Coat", price: "₹28,500", badge: null, img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80" },
  { cat: "Accessories", name: "Velvet Evening Bag", price: "₹12,200", badge: "NEW", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80" },
  { cat: "Ready-to-Wear", name: "Draped Silk Midi", price: "₹18,900", badge: null, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  { cat: "Footwear", name: "Sculptural Mule", price: "₹9,800", badge: "HOT", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80" },
];

const trending = [
  { name: "Onyx Trench", price: "₹34,000", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80", badge: "TRENDING" },
  { name: "Satin Slip Dress", price: "₹16,500", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80", badge: null },
  { name: "Pearl Frame Glasses", price: "₹4,200", img: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&q=80", badge: "EDITOR'S PICK" },
  { name: "Plissé Skirt Set", price: "₹22,800", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80", badge: null },
  { name: "Knotted Heel Sandal", price: "₹11,600", img: "https://i.pinimg.com/1200x/ee/7a/9c/ee7a9c77065c018cf6560d86b7399e2f.jpg", badge: "LOW STOCK" },
];

const marqueeItems = ["New Season Arrivals", "Free Shipping Over ₹5,000", "SS25 Collection", "Exclusive Memberships", "Shop The Edit", "Designer Collaborations"];

export default function Home() {
  const { handleHoverIn, handleHoverOut } = useOutletContext();
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] h-screen min-h-[700px] overflow-hidden relative">
        <div className="bg-vogue-black flex flex-col justify-end p-8 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80')] bg-cover bg-center opacity-28"></div>
          <div className="relative z-10">
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-vogue-black font-bold mb-6">Spring / Summer 2025</p>
            <h1 className="font-serif text-[clamp(3.5rem,6vw,5.5rem)] font-light leading-[0.95] text-vogue-black/70 mb-8">
              Dressed<br />in<br /><em className="italic text-vogue-gold">Silence</em>
            </h1>
            <p className="text-sm leading-relaxed text-vogue-black/60 max-w-[320px] mb-12 font-light">
              Where restraint becomes the loudest statement. Discover our most awaited collection — crafted for those who know that elegance needs no introduction.
            </p>
            <a href="#" onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut} className="inline-flex items-center gap-4 text-[0.72rem] tracking-[0.2em] uppercase text-vogue-black no-underline font-bold group">
              <span className="w-10 h-[0.5px] bg-vogue-gold transition-all duration-400 group-hover:w-[70px]"></span>
              Explore the Collection
            </a>
          </div>
        </div>
        <div className="relative overflow-hidden group">
          <img
            className="w-full h-full object-cover scale-105 transition-transform duration-[8s] group-hover:scale-100"
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80"
            alt="hero fashion"
          />
          <div className="absolute bottom-12 left-[0rem] z-20 bg-vogue-ivory p-8 w-[280px]">
            <p className="text-[0.62rem] tracking-[0.25em] uppercase text-vogue-crimson font-bold mb-2">Featured Piece</p>
            <p className="font-serif text-2xl font-normal mb-1">Obsidian Wrap Coat</p>
            <p className="text-sm text-vogue-gray font-light tracking-[0.05em]">Starting from ₹42,000</p>
          </div>
          <div className="absolute bottom-14 right-12 font-serif text-7xl font-light text-black/6 leading-none z-10">01</div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-vogue-black bg-vogue-black py-4 overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-12 animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="font-serif text-base font-light italic tracking-[0.08em] text-vogue-offwhite flex-shrink-0">
              {item}
              {i < marqueeItems.length * 2 - 1 && <span className="text-vogue-gold mx-4 not-italic text-xs">✦</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Editorial Feature */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] border-b border-vogue-light-gray">
        <div className="relative overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
            alt="editorial"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute top-10 left-10 bg-vogue-crimson text-white text-[0.6rem] tracking-[0.25em] uppercase px-4 py-1.5 font-bold">Exclusive Editorial</span>
        </div>
        <div className="bg-vogue-offwhite p-12 md:p-20 flex flex-col justify-center">
          <p ref={addRevealRef} className="reveal text-[0.62rem] tracking-[0.3em] uppercase text-vogue-gray font-bold mb-8">Issue No. 04 — 2025</p>
          <h2 ref={addRevealRef} className="reveal reveal-delay-1 font-serif text-[clamp(2.8rem,4vw,4rem)] font-light leading-[1.1] mb-8">
            The Art of<br /><em className="italic text-vogue-crimson">Quiet Luxury</em>
          </h2>
          <p ref={addRevealRef} className="reveal reveal-delay-2 text-[0.88rem] leading-relaxed text-[#555] max-w-[420px] mb-12 font-light">
            In a world of excess, the boldest choice is restraint. Our SS25 editorial explores the space between whisper and statement — where fabric speaks in textures, and silhouettes tell stories that words cannot.
          </p>
          <a href="#" ref={addRevealRef} className="reveal reveal-delay-3 inline-flex items-center gap-4 text-[0.72rem] tracking-[0.2em] uppercase text-vogue-black no-underline font-bold border-b border-vogue-black pb-1.5 w-fit transition-colors hover:text-vogue-crimson hover:border-vogue-crimson" onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}>
            Read the Story →
          </a>
          <div ref={addRevealRef} className="reveal reveal-delay-3 flex gap-12 mt-16 pt-10 border-t border-vogue-light-gray">
            <div><span className="font-serif text-3xl font-normal block">240+</span><span className="text-[0.65rem] tracking-[0.2em] uppercase text-vogue-gray font-bold">Exclusive Pieces</span></div>
            <div><span className="font-serif text-3xl font-normal block">18</span><span className="text-[0.65rem] tracking-[0.2em] uppercase text-vogue-gray font-bold">Designers</span></div>
            <div><span className="font-serif text-3xl font-normal block">SS25</span><span className="text-[0.65rem] tracking-[0.2em] uppercase text-vogue-gray font-bold">Current Season</span></div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-28 px-6 md:px-12 bg-vogue-ivory">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p ref={addRevealRef} className="reveal text-[0.62rem] tracking-[0.3em] uppercase text-vogue-crimson font-bold mb-2">Curated Selection</p>
            <h2 ref={addRevealRef} className="reveal reveal-delay-1 font-serif text-[clamp(2rem,3.5vw,3rem)] font-light">New <em className="italic">Arrivals</em></h2>
          </div>
          <a href="#" ref={addRevealRef} className="reveal reveal-delay-2 text-[0.7rem] tracking-[0.2em] uppercase text-vogue-black no-underline font-bold border-b border-vogue-black pb-1 whitespace-nowrap transition-colors hover:text-vogue-crimson hover:border-vogue-crimson" onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}>
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr] gap-[1.5px]">
          {collections.map((c, i) => (
            <div key={i} className={`relative overflow-hidden bg-vogue-light-gray ${i === 0 ? 'lg:row-span-2' : ''}`} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}>
              <img className={`w-full h-full object-cover transition-transform duration-700 ${i === 0 ? 'min-h-[660px]' : 'min-h-[320px]'} hover:scale-105`} src={c.img} alt={c.name} />
              {c.badge && (
                <span className={`absolute top-4 left-4 ${c.badge === 'HOT' ? 'bg-vogue-crimson' : 'bg-vogue-black'} text-white text-[0.58rem] tracking-[0.2em] px-3 py-1.5 font-bold uppercase`}>
                  {c.badge}
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-8 pb-7 bg-gradient-to-t from-vogue-black/75 to-transparent translate-y-2 transition-transform duration-400 hover:translate-y-0">
                <p className="text-[0.6rem] tracking-[0.25em] uppercase text-vogue-gold font-bold mb-1">{c.cat}</p>
                <p className="font-serif text-2xl font-normal text-white mb-0.5">{c.name}</p>
                <p className="text-sm text-white/70 font-light">{c.price}</p>
              </div>
              <button className="absolute top-5 right-5 w-9 h-9 bg-white border-none flex items-center justify-center text-xl opacity-0 -translate-y-1 transition-all duration-300 hover:opacity-100 hover:translate-y-0">+</button>
            </div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="py-28 px-6 md:px-12 bg-vogue-gray/100">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p ref={addRevealRef} className="reveal text-[0.62rem] tracking-[0.3em] uppercase text-vogue-black font-bold mb-2">What's Hot</p>
            <h2 ref={addRevealRef} className="reveal reveal-delay-1 font-serif text-[clamp(2rem,3.5vw,3rem)] font-light text-vogue-offwhite"><em className="italic">Trending</em> Now</h2>
          </div>
          <a href="#" ref={addRevealRef} className="reveal reveal-delay-2 text-[0.7rem] tracking-[0.2em] uppercase text-vogue-offwhite no-underline font-bold border-b border-vogue-offwhite/40 pb-1 whitespace-nowrap transition-colors hover:text-vogue-gold hover:border-vogue-gold" onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}>
            Shop All →
          </a>
        </div>
        <div ref={addRevealRef} className="reveal flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {trending.map((t, i) => (
            <div key={i} className="flex-shrink-0 w-[260px] border border-vogue-offwhite/12 relative overflow-hidden" onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}>
              <img className="w-full h-[340px] object-cover transition-transform duration-600 hover:scale-105" src={t.img} alt={t.name} />
              {t.badge && <span className="absolute top-4 left-4 bg-vogue-crimson text-white text-[0.58rem] tracking-[0.2em] uppercase px-3 py-1.5 font-bold">{t.badge}</span>}
              <div className="p-5 bg-black/95">
                <p className="font-serif text-xs text-vogue-gold tracking-[0.15em] mb-2">0{i+1}</p>
                <p className="font-serif text-xl font-normal text-vogue-offwhite mb-1">{t.name}</p>
                <p className="text-sm text-vogue-offwhite/50 font-light">{t.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      
    </>
  );
}