import { useNavigate } from "react-router-dom";

export default function LoginRequiredModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-serif text-[#111] mb-3">Login Required</h2>
        <p className="text-[#666] mb-6">
          Please login or signup first to add items to cart or wishlist.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onClose();
              navigate("/login");
            }}
            className="px-5 py-2 bg-black text-white rounded-lg"
          >
            Login
          </button>

          <button
            onClick={() => {
              onClose();
              navigate("/signup");
            }}
            className="px-5 py-2 bg-[#b6453c] text-white rounded-lg"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}