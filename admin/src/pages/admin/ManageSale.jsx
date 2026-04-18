// admin/src/pages/admin/ManageSale.jsx
import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export default function ManageSale() {
  const { saleItems, addSaleItem, updateSaleItem, deleteSaleItem, loading: contextLoading } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    salePrice: '',
    discount: '',
    category: '',
    img: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleOpenModal = (item = null) => {
    setError('');
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        originalPrice: item.originalPrice,
        salePrice: item.salePrice,
        discount: item.discount,
        category: item.category,
        img: item.img,
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', originalPrice: '', salePrice: '', discount: '', category: '', img: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!submitting) {
      setModalOpen(false);
      setEditingItem(null);
      setError('');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (editingItem) {
        await updateSaleItem(editingItem._id || editingItem.id, formData);
      } else {
        await addSaleItem(formData);
      }
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save sale item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sale item? This action cannot be undone.')) {
      try {
        await deleteSaleItem(id);
      } catch (err) {
        alert('Failed to delete sale item');
      }
    }
  };

  if (contextLoading && saleItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading sale items...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-gray-900">Sale Items</h1>
          <p className="text-gray-500 text-sm mt-1">Manage discounted products</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="text-lg">+</span>
          <span className="text-sm font-medium uppercase tracking-wide">Add Sale Item</span>
        </button>
      </div>

      {/* Sale Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Original</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sale Price</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {saleItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">🏷️</span>
                      <p className="text-sm">No sale items yet. Click "Add Sale Item" to get started.</p>
                    </div>
                   </td>
                </tr>
              ) : (
                saleItems.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">{item.name}</td>
                    <td className="py-4 px-6 text-gray-500 line-through">{item.originalPrice}</td>
                    <td className="py-4 px-6 text-red-600 font-semibold">{item.salePrice}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {item.discount} OFF
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:text-blue-800 mr-4 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id || item.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-light text-gray-900">
                {editingItem ? 'Edit Sale Item' : 'New Sale Item'}
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none disabled:opacity-50"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Product Name</label>
                  <input
                    name="name"
                    placeholder="e.g., Noir Signature Coat"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Original Price</label>
                  <input
                    name="originalPrice"
                    placeholder="e.g., ₹28,500"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Sale Price</label>
                  <input
                    name="salePrice"
                    placeholder="e.g., ₹19,950"
                    value={formData.salePrice}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Discount (e.g., 30%)</label>
                  <input
                    name="discount"
                    placeholder="e.g., 30%"
                    value={formData.discount}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <input
                    name="category"
                    placeholder="e.g., Outerwear"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                  <input
                    name="img"
                    placeholder="https://example.com/product.jpg"
                    value={formData.img}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:bg-gray-100"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                  {editingItem ? 'Update' : 'Create'} Sale Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}