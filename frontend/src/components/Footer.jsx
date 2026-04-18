import { Link } from 'react-router-dom';

export default function Footer({ onHoverIn, onHoverOut }) {
  const columns = [
    { title: 'Shop', links: ['New In', 'Collections', 'Designers', 'Sale', 'Gift Cards'] },
    { title: 'World', links: ['Editorial', 'Lookbooks', 'Sustainability', 'Careers', 'Press'] },
    { title: 'Help', links: ['Contact Us', 'Shipping & Returns', 'Size Guide', 'Privacy Policy', 'Terms'] },
  ];

  return (
    <footer className="bg-vogue-black text-vogue-offwhite py-20 px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div>
          <p className="font-serif text-3xl font-light tracking-[0.2em] uppercase mb-4">V<span className="text-vogue-gold">●</span>GUE</p>
          <p className="text-sm text-vogue-offwhite/45 leading-relaxed font-light max-w-[240px]">
            Redefining modern luxury through thoughtful curation, rare craftsmanship, and an unyielding commitment to beauty.
          </p>
        </div>
        {columns.map(col => (
          <div key={col.title}>
            <p className="text-[0.62rem] tracking-[0.28em] uppercase text-vogue-gold font-bold mb-6">{col.title}</p>
            <ul className="flex flex-col gap-3 list-none">
              {col.links.map(link => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(/\s/g, '')}`}
                    onMouseEnter={onHoverIn}
                    onMouseLeave={onHoverOut}
                    className="text-sm text-vogue-offwhite/55 no-underline font-light hover:text-vogue-offwhite transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-vogue-offwhite/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[0.68rem] text-vogue-offwhite/30 tracking-[0.08em] font-light">© 2025 Vogue. All rights reserved.</p>
        <div className="flex gap-6">
          {['Instagram', 'Pinterest', 'TikTok', 'YouTube'].map(s => (
            <a key={s} href="#" onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} className="text-[0.65rem] tracking-[0.2em] uppercase text-vogue-offwhite/40 no-underline font-bold hover:text-vogue-gold">
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}