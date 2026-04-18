// admin/src/pages/admin/ManageCloths.jsx
import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 text-2xl mb-3">🗑</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageCloths() {
  const { cloths, addCloth, updateCloth, deleteCloth, loading: contextLoading } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '', pieces: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  const handleOpenModal = (item = null) => {
    setError('');
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description, image: item.image, pieces: item.pieces });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', image: '', pieces: 0 });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!submitting) { setModalOpen(false); setEditingItem(null); setError(''); }
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
        await updateCloth(editingItem._id || editingItem.id, formData); // FIXED: was updateCloths
      } else {
        await addCloth(formData);
      }
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save cloth');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteCloth(deleteConfirm.id);
      setDeleteConfirm({ open: false, id: null, name: '' });
    } catch (err) {
      alert('Failed to delete cloth');
    } finally {
      setDeleting(false);
    }
  };

  if (contextLoading && cloths.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading cloths...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-gray-900">Cloths</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your fashion cloths · {cloths.length} items</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition shadow-sm">
          <span className="text-lg">+</span>
          <span className="text-sm font-medium uppercase tracking-wide">Add Cloth</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pieces</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cloths.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center text-gray-400"><p className="text-sm">No cloths yet. Click "Add Cloth" to get started.</p></td></tr>
              ) : (
                cloths.map(col => (
                  <tr key={col._id || col.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <img src={col.image} alt={col.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">{col.name}</td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{col.description}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{col.pieces} pieces</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => handleOpenModal(col)} className="text-blue-600 hover:text-blue-800 mr-4 text-sm transition">Edit</button>
                      <button onClick={() => setDeleteConfirm({ open: true, id: col._id || col.id, name: col.name })} className="text-red-600 hover:text-red-800 text-sm transition">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-light text-gray-900">{editingItem ? 'Edit Cloth' : 'New Cloth'}</h2>
              <button onClick={handleCloseModal} disabled={submitting} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {[
                  { name: 'name', label: 'Cloth Name', placeholder: 'e.g., Noir' },
                  { name: 'image', label: 'Image URL', placeholder: 'https://example.com/cloth.jpg' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{field.label}</label>
                    <input name={field.name} placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} disabled={submitting} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:bg-gray-100" required />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</label>
                  <textarea name="description" placeholder="Describe the cloth..." value={formData.description} onChange={handleChange} rows="3" disabled={submitting} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none disabled:bg-gray-100" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Number of Pieces</label>
                  <input type="number" name="pieces" placeholder="e.g., 24" value={formData.pieces} onChange={handleChange} disabled={submitting} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:bg-gray-100" required />
                </div>
              </div>
              {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={handleCloseModal} disabled={submitting} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2">
                  {submitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                  {editingItem ? 'Update' : 'Create'} Cloth
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteConfirm.open}
        title="Delete Cloth?"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, id: null, name: '' })}
        loading={deleting}
      />
    </div>
  );
}