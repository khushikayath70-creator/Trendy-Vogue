import { useOutletContext } from 'react-router-dom';

export default function Contact() {
  const { handleHoverIn, handleHoverOut } = useOutletContext();

  return (
    <div className="pt-40 pb-28 px-6 md:px-12 bg-vogue-ivory min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-4">Contact</h1>
          <p className="text-vogue-gray text-lg max-w-2xl mx-auto">We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-light mb-6">Send us a message</h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm uppercase tracking-wide mb-2">Name</label>
                <input
                  type="text"
                  className="w-full border-b border-vogue-light-gray py-2 bg-transparent focus:outline-none focus:border-vogue-crimson transition-colors"
                  onMouseEnter={handleHoverIn}
                  onMouseLeave={handleHoverOut}
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wide mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border-b border-vogue-light-gray py-2 bg-transparent focus:outline-none focus:border-vogue-crimson transition-colors"
                  onMouseEnter={handleHoverIn}
                  onMouseLeave={handleHoverOut}
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wide mb-2">Message</label>
                <textarea
                  rows="4"
                  className="w-full border border-vogue-light-gray p-3 bg-transparent focus:outline-none focus:border-vogue-crimson transition-colors"
                  onMouseEnter={handleHoverIn}
                  onMouseLeave={handleHoverOut}
                ></textarea>
              </div>
              <button
                type="submit"
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
                className="w-full py-3 bg-vogue-black text-vogue-ivory uppercase tracking-wide text-sm hover:bg-vogue-crimson transition-all"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Store Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xl font-light mb-3">Visit Us</h3>
              <p className="text-vogue-gray">Vogue Flagship Store<br />123 Fashion Avenue,<br />Mumbai 400001, India</p>
            </div>
            <div>
              <h3 className="font-serif text-xl font-light mb-3">Customer Care</h3>
              <p className="text-vogue-gray">Email: care@vogue.com<br />Phone: +91 22 1234 5678<br />Mon–Fri, 10am–7pm</p>
            </div>
            <div>
              <h3 className="font-serif text-xl font-light mb-3">Press & Partnerships</h3>
              <p className="text-vogue-gray">For media inquiries:<br />press@vogue.com</p>
            </div>
            <div className="pt-4">
              <h3 className="font-serif text-xl font-light mb-3">Follow Us</h3>
              <div className="flex gap-6">
                {['Instagram', 'Pinterest', 'TikTok', 'YouTube'].map(social => (
                  <a
                    key={social}
                    href="#"
                    onMouseEnter={handleHoverIn}
                    onMouseLeave={handleHoverOut}
                    className="text-sm uppercase tracking-wider text-vogue-gray hover:text-vogue-black transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-20 h-64 bg-vogue-light-gray flex items-center justify-center text-vogue-gray text-sm uppercase tracking-wider">
          Store Location Map
        </div>
      </div>
    </div>
  );
}