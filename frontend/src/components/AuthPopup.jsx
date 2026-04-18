import { motion, AnimatePresence } from "framer-motion";

export default function AuthPopup({
  open,
  title,
  message,
  type = "success",
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
}) {
  if (!open) return null;

  const isSuccess = type === "success";
  const isConfirm = type === "confirm";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px] flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full max-w-md rounded-[28px] border border-[#ece4da] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.16)] overflow-hidden"
        >
          <div className="px-7 pt-7 pb-5 text-center">
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                isSuccess
                  ? "bg-[#f5eee8] text-[#111]"
                  : "bg-[#f8eceb] text-[#b6453c]"
              }`}
            >
              {isConfirm ? (
                <span className="text-3xl">?</span>
              ) : (
                <span className="text-3xl">✓</span>
              )}
            </div>

            <h2 className="font-serif text-3xl font-light text-[#111] mb-2">
              {title}
            </h2>

            <p className="text-sm leading-7 text-[#6e655d] max-w-sm mx-auto">
              {message}
            </p>
          </div>

          <div className="px-6 pb-6 flex gap-3 justify-center">
            {showCancel && (
              <button
                onClick={onClose}
                className="min-w-[120px] rounded-full border border-[#d9cfc5] px-5 py-3 text-sm uppercase tracking-[0.16em] text-[#111] transition-all hover:bg-[#f7f2ed]"
              >
                {cancelText}
              </button>
            )}

            <button
              onClick={onConfirm || onClose}
              className={`min-w-[140px] rounded-full px-5 py-3 text-sm uppercase tracking-[0.16em] text-white transition-all ${
                isConfirm
                  ? "bg-[#111] hover:bg-[#222]"
                  : "bg-[#111] hover:bg-[#222]"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

