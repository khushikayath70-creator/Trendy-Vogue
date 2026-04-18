import { AnimatePresence, motion } from "framer-motion";

export default function Toast({ open, message, type = "success" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-8 left-1/2 z-[500] flex items-center gap-3 rounded-full border border-[#e8dfd5] bg-white px-6 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          style={{ transform: "translateX(-50%)" }}
        >
          <span className="text-lg">
            {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
          </span>
          <p className="text-sm font-medium text-[#1f1a17] tracking-wide">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}