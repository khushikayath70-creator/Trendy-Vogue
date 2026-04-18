import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminForm({ type, initialData, onSubmit, onDelete }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-vogue-ivory pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-sm">
        <h1 className="font-serif text-3xl font-light mb-6">{initialData.id ? `Edit ${type}` : `Add New ${type}`}</h1>
        <form onSubmit={handleSubmit}>
          {Object.keys(initialData).filter(k => k !== 'id').map(key => (
            <div key={key} className="mb-4">
              <label className="block text-sm uppercase tracking-wide mb-1">{key}</label>
              <input
                type={key.includes('img') || key.includes('image') ? 'url' : 'text'}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full border-b border-vogue-light-gray py-2 focus:outline-none focus:border-vogue-crimson"
                required
              />
            </div>
          ))}
          <div className="flex gap-4 mt-6">
            <button type="submit" className="px-6 py-2 bg-vogue-black text-vogue-ivory uppercase text-sm">Save</button>
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-vogue-black uppercase text-sm">Cancel</button>
            {onDelete && <button type="button" onClick={onDelete} className="px-6 py-2 bg-red-600 text-white uppercase text-sm ml-auto">Delete</button>}
          </div>
        </form>
      </div>
    </div>
  );
}