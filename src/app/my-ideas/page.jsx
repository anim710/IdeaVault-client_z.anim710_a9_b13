'use client';
import PrivateRoute from '@/components/PrivateRoute';
import { useEffect, useState } from 'react';
import { privateApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tech', 'Health', 'AI', 'Education', 'Finance', 'Other'];

export default function MyIdeasPage() {
  const [ideas, setIdeas]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editingIdea, setEditingIdea] = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [deleteId, setDeleteId]   = useState(null);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    privateApi()
      .get('/ideas/my-ideas')
      .then((res) => setIdeas(res.data))
      .catch(() => toast.error('Failed to load your ideas.'))
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (idea) => {
    setEditingIdea(idea._id);
    setEditForm({
      title:            idea.title,
      shortDescription: idea.shortDescription,
      category:         idea.category,
      imageURL:         idea.imageURL || '',
    });
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await privateApi().put(`/ideas/${editingIdea}`, editForm);
      setIdeas(ideas.map((i) => (i._id === editingIdea ? res.data : i)));
      setEditingIdea(null);
      toast.success('Idea updated successfully!');
    } catch {
      toast.error('Failed to update idea.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await privateApi().delete(`/ideas/${deleteId}`);
      setIdeas(ideas.filter((i) => i._id !== deleteId));
      setDeleteId(null);
      toast.success('Idea deleted.');
    } catch {
      toast.error('Failed to delete idea.');
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-4xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-1">My Ideas</h1>
        <p className="text-base-content/60 mb-8">
          Manage the startup ideas you have posted.
        </p>

        {loading ? (
          <LoadingSpinner />
        ) : ideas.length === 0 ? (
          <div className="text-center py-24 text-base-content/50">
            <p className="text-5xl mb-4">💡</p>
            <p className="text-lg">You have not posted any ideas yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="card bg-base-100 border border-base-200 shadow-sm"
              >
                <div className="card-body flex-row items-center gap-4 p-4">
                  {idea.imageURL && (
                    <img
                      src={idea.imageURL}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                      alt=""
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="badge badge-outline badge-sm mb-1">
                      {idea.category}
                    </span>
                    <h3 className="font-semibold truncate">{idea.title}</h3>
                    <p className="text-sm text-base-content/60 line-clamp-1">
                      {idea.shortDescription}
                    </p>
                    <p className="text-xs text-base-content/40 mt-1">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => openEdit(idea)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error btn-outline"
                      onClick={() => setDeleteId(idea._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Edit Modal ── */}
        {editingIdea && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Edit idea</h3>
              <div className="space-y-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    className="input input-bordered"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Short description</span>
                  </label>
                  <input
                    className="input input-bordered"
                    value={editForm.shortDescription}
                    onChange={(e) =>
                      setEditForm({ ...editForm, shortDescription: e.target.value })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Image URL</span>
                  </label>
                  <input
                    className="input input-bordered"
                    value={editForm.imageURL}
                    onChange={(e) =>
                      setEditForm({ ...editForm, imageURL: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setEditingIdea(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving
                    ? <span className="loading loading-spinner loading-sm" />
                    : 'Save changes'
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirmation Modal ── */}
        {deleteId && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Delete this idea?</h3>
              <p className="py-4 text-base-content/70">
                This action cannot be undone. The idea will be permanently removed.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-error" onClick={handleDelete}>
                  Yes, delete it
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PrivateRoute>
  );
}