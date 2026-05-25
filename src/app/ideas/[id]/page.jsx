'use client';
import { useEffect, useState } from 'react';
import { publicApi, privateApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function IdeaDetailPage() {
  const { id }    = useParams();
  const { user }  = useAuth();

  const [idea, setIdea]         = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [editText, setEditText]       = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [ideaRes, commentsRes] = await Promise.all([
          publicApi.get(`/ideas/${id}`),
          publicApi.get(`/comments/idea/${id}`),
        ]);
        setIdea(ideaRes.data);
        setComments(commentsRes.data);
      } catch {
        toast.error('Failed to load idea.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await privateApi().post('/comments', {
        ideaId:    id,
        text:      commentText,
        userPhoto: user.photo || '',
      });
      setComments([res.data, ...comments]);
      setCommentText('');
      toast.success('Comment posted!');
    } catch {
      toast.error('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSave = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await privateApi().put(`/comments/${commentId}`, {
        text: editText,
      });
      setComments(comments.map((c) => (c._id === commentId ? res.data : c)));
      setEditingId(null);
      toast.success('Comment updated!');
    } catch {
      toast.error('Failed to update comment.');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await privateApi().delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success('Comment deleted.');
    } catch {
      toast.error('Failed to delete comment.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!idea)   return (
    <div className="text-center py-24">
      <p className="text-lg text-base-content/60">Idea not found.</p>
      <Link href="/ideas" className="btn btn-primary mt-4">Back to ideas</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Cover image */}
      {idea.imageURL && (
        <img
          src={idea.imageURL}
          alt={idea.title}
          className="w-full h-64 object-cover rounded-2xl mb-6"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Meta */}
      <span className="badge badge-primary mb-3">{idea.category}</span>
      {idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {idea.tags.map((tag) => (
            <span key={tag} className="badge badge-outline badge-sm">{tag}</span>
          ))}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-3">{idea.title}</h1>
      <p className="text-base-content/70 text-lg mb-6">{idea.shortDescription}</p>

      {/* Author */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-base-200">
        <div className="avatar">
          <div className="w-10 rounded-full">
            <img
              src={idea.authorPhoto || 'https://placehold.co/40?text=U'}
              alt={idea.authorName}
            />
          </div>
        </div>
        <div>
          <p className="font-medium text-sm">{idea.authorName}</p>
          <p className="text-xs text-base-content/50">
            {new Date(idea.createdAt).toLocaleDateString()}
          </p>
        </div>
        {idea.estimatedBudget > 0 && (
          <div className="ml-auto text-right">
            <p className="text-xs text-base-content/50">Est. Budget</p>
            <p className="font-semibold">${idea.estimatedBudget.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Detail cards */}
      <div className="space-y-4 mb-10">
        {idea.problemStatement && (
          <div className="bg-base-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-2">
              Problem
            </h3>
            <p className="text-sm leading-relaxed">{idea.problemStatement}</p>
          </div>
        )}
        {idea.proposedSolution && (
          <div className="bg-base-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-2">
              Solution
            </h3>
            <p className="text-sm leading-relaxed">{idea.proposedSolution}</p>
          </div>
        )}
        {idea.detailedDescription && (
          <div className="bg-base-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-2">
              Details
            </h3>
            <p className="text-sm leading-relaxed">{idea.detailedDescription}</p>
          </div>
        )}
        {idea.targetAudience && (
          <div className="bg-base-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-2">
              Target Audience
            </h3>
            <p className="text-sm">{idea.targetAudience}</p>
          </div>
        )}
      </div>

      {/* Comments section */}
      <div className="divider font-semibold">
        Comments ({comments.length})
      </div>

      {/* Add comment */}
      {user ? (
        <form onSubmit={handleAddComment} className="flex gap-2 mb-8">
          <input
            className="input input-bordered flex-1"
            placeholder="Share your thoughts on this idea..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? <span className="loading loading-spinner loading-sm" />
              : 'Post'
            }
          </button>
        </form>
      ) : (
        <p className="text-center text-sm text-base-content/60 mb-8">
          <Link href="/login" className="text-primary font-medium">Login</Link>{' '}
          to leave a comment.
        </p>
      )}

      {/* Comment list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-base-content/40 py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="card bg-base-100 border border-base-200 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="avatar">
                  <div className="w-7 rounded-full">
                    <img
                      src={comment.userPhoto || 'https://placehold.co/40?text=U'}
                      alt={comment.userName}
                    />
                  </div>
                </div>
                <span className="font-medium text-sm">{comment.userName}</span>
                <span className="text-xs text-base-content/40 ml-auto">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>

              {editingId === comment._id ? (
                <div className="flex gap-2 mt-1">
                  <input
                    className="input input-bordered input-sm flex-1"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditSave(comment._id)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-sm text-base-content/80">{comment.text}</p>
              )}

              {/* Edit / Delete — only for own comments */}
              {user && user.id === comment.userId && editingId !== comment._id && (
                <div className="flex gap-2 mt-3">
                  <button
                    className="btn btn-xs btn-outline"
                    onClick={() => {
                      setEditingId(comment._id);
                      setEditText(comment.text);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs btn-error btn-outline"
                    onClick={() => handleDelete(comment._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}