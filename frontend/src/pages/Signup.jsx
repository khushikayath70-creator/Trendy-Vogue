// frontend/src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthPopup from "../components/AuthPopup";
import API from "../api/api";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({ title: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await API.post("/auth/signup", formData);
      login(res.data);
      setPopupData({ title: "Account Created", message: "Your signup was successful. You are now logged in." });
      setPopupOpen(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef] px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-serif mb-6 text-center">Signup</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg outline-none focus:border-[#111] transition"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg outline-none focus:border-[#111] transition"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg outline-none focus:border-[#111] transition"
              required
            />

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-60 hover:bg-gray-800 transition"
            >
              {submitting ? "Please wait..." : "Signup"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">Login</Link>
          </p>
        </div>
      </div>

      <AuthPopup
        open={popupOpen}
        title={popupData.title}
        message={popupData.message}
        onClose={() => {
          setPopupOpen(false);
          navigate("/");
        }}
      />
    </>
  );
}