import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// Sample new arrivals data – replace with real data later
const newArrivals = [
  {
    name: "Dresses",
    price: "₹34,500",
    category: "Outerwear",
    img: "https://img.ltwebstatic.com/images3_pi/2024/10/09/fd/17284572700a46ca1936c234dbaa9e673547e26635_thumbnail_900x.jpg",
    redirectTo: "/cloths",
  },
  {
    name: "Modern Bottom Wear",
    price: "₹22,800",
    category: "Bottoms",
    img: "https://my-test-11.slatic.net/p/87d7514c1614e9f6905421501aac6400.jpg",
    redirectTo: "/cloths",
  },
  {
    name: "Women’s Tops",
    price: "₹12,400",
    category: "Tops",
    img: "https://i.pinimg.com/originals/8f/73/92/8f73926a51c5bb3909c14b50cc8330de.jpg",
    redirectTo: "/cloths",
  },
  {
    name: "Oversized Knit Cardigan",
    price: "₹18,900",
    category: "Knitwear",
    img: "https://tse4.mm.bing.net/th/id/OIP.w_1_s219HVaevQXEt96yfAHaLz?rs=1&pid=ImgDetMain&o=7&rm=3",
    redirectTo: "/cloths",
  },
  {
    name: "Trendy Footwear",
    price: "₹15,200",
    category: "Footwear",
    img: "https://www.charleskeith.com/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-ck-products/default/dw02feb6e1/images/hi-res/2024-L6-SL1-91720006-84-3.jpg?sw=756&sh=1008",
    redirectTo: "/footwear",
  },
  {
    name: "Elegant Accessories",
    price: "₹7,800",
    category: "Jewellery",
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80",
    redirectTo: "/accessories",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function NewIn() {
  const { handleHoverIn, handleHoverOut } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="pt-40 pb-28 px-6 md:px-12 bg-gradient-to-b from-[#faf7f2] via-[#f8f5ef] to-[#f5f1ea] min-h-screen">
      {/* Header */}
      <motion.div
        className="max-w-7xl mx-auto mb-16"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[#9b8b7a] mb-4">
          Latest Collection
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-light mb-4 text-[#1f1a17]">
          New In
        </h1>
        <p className="text-[#6f675f] text-lg max-w-2xl font-light leading-8">
          Fresh off the runway — discover the newest pieces, refined textures,
          modern tailoring, and elevated essentials for a luxurious everyday wardrobe.
        </p>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {newArrivals.map((item, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            className="group relative rounded-[28px] overflow-hidden bg-white/80 backdrop-blur-sm border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-500"
            onMouseEnter={handleHoverIn}
            onMouseLeave={handleHoverOut}
            whileHover={{ y: -8 }}
          >

            {/* Image */}
            <div className="relative overflow-hidden">
              <motion.img
                src={item.img}
                alt={item.name}
                className="w-full h-96 object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-70 pointer-events-none" />

              <div className="absolute left-4 bottom-4 z-10">
                <span className="inline-block px-4 py-2 rounded-full bg-white/85 backdrop-blur-md text-[11px] uppercase tracking-[0.25em] text-[#6d6257] shadow-sm">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-serif text-[1.45rem] leading-snug font-normal mb-2 text-[#1f1a17]">
                {item.name}
              </h3>

              <div className="flex items-center justify-between mb-5">
                <p className="text-[#a13d35] font-semibold text-lg">{item.price}</p>
                <p className="text-sm text-[#8a8178]">Inclusive of luxury finish</p>
              </div>

              {/* Quick Shop Button */}
              <div className="flex items-center">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => navigate(item.redirectTo)}
                  className="w-full h-12 rounded-full bg-[#1f1a17] text-[#f8f4ee] text-sm uppercase tracking-[0.18em] font-medium flex items-center justify-center hover:bg-[#352e29] transition-all duration-300"
                >
                  Quick Shop
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Editorial Luxury Feature Section */}
<motion.section
  className="max-w-7xl mx-auto mt-24"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.9, ease: "easeOut" }}
  viewport={{ once: true, amount: 0.2 }}
>
  <div className="relative overflow-hidden rounded-[40px] min-h-[520px] md:min-h-[620px] shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
    {/* Background Image */}
    <motion.img
      src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600&q=80"
      alt="Editorial Fashion"
      className="absolute inset-0 w-full h-full object-cover"
      initial={{ scale: 1.08 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      viewport={{ once: true }}
    />

    {/* Dark Luxury Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_30%)]" />

    {/* Content */}
    <div className="relative z-10 h-full flex items-center px-8 py-16 md:px-16 lg:px-20">
      <motion.div
        className="max-w-2xl text-[#f8f3ec]"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <p className="text-[11px] md:text-xs uppercase tracking-[0.38em] text-[#d7b892] mb-5">
          Editorial Feature
        </p>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight font-light mb-6">
          The Art of
          <br />
          Dressing
        </h2>

        <p className="text-sm md:text-lg leading-7 md:leading-8 text-[#f8f3ec]/78 max-w-xl mb-8">
          Refined silhouettes, elevated essentials, and timeless expression —
          crafted for those who define their own elegance with confidence and grace.
        </p>

        {/* Small editorial line */}
        <div className="mt-10 pt-6 border-t border-white/20">
          <p className="text-sm md:text-base text-[#f8f3ec]/70 italic tracking-[0.06em]">
            Crafted for modern elegance.
          </p>
        </div>
      </motion.div>
    </div>
  </div>
</motion.section>
    </div>
  );
}