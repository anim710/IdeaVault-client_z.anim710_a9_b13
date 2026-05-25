'use client';
import PrivateRoute from '@/components/PrivateRoute';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { privateApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Tech', 'Health', 'AI', 'Education', 'Finance', 'Other'];

export default function AddIdeaPage() {
  const { user }  = useAuth();
  const router    = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title:               '',
    shortDescription:    '',
    detailedDescription: '',
    category:            'Tech',
    tags:                '',
    imageURL:            '',
    estimatedBudget:     '',
    targetAudience:      '',
    problemStatement:    '',
    proposedSolution:    '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await privateApi().post('/ideas', {
        ...form,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        estimatedBudget: form.estimatedBudget ? Number(form.estimatedBudget) : 0,
        authorName:  user.name,
        authorPhoto: user.photo || '',
      });
      toast.success('Your idea has been submitted!');
      router.push('/my-ideas');
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-2xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-1">Share your idea</h1>
        <p className="text-base-content/60 mb-8">
          Fill in the details to post your startup idea to the community.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Idea title *</span>
            </label>
            <input
              name="title"
              type="text"
              className="input input-bordered"
              placeholder="My amazing startup idea"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Short description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Short description *</span>
            </label>
            <input
              name="shortDescription"
              type="text"
              className="input input-bordered"
              placeholder="One sentence summary of your idea"
              value={form.shortDescription}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Category *</span>
            </label>
            <select
              name="category"
              className="select select-bordered"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Problem */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Problem statement</span>
            </label>
            <textarea
              name="problemStatement"
              className="textarea textarea-bordered h-24"
              placeholder="What problem does this solve?"
              value={form.problemStatement}
              onChange={handleChange}
            />
          </div>

          {/* Solution */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Proposed solution</span>
            </label>
            <textarea
              name="proposedSolution"
              className="textarea textarea-bordered h-24"
              placeholder="How do you plan to solve it?"
              value={form.proposedSolution}
              onChange={handleChange}
            />
          </div>

          {/* Detailed description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Detailed description</span>
            </label>
            <textarea
              name="detailedDescription"
              className="textarea textarea-bordered h-32"
              placeholder="Tell the community more about your idea..."
              value={form.detailedDescription}
              onChange={handleChange}
            />
          </div>

          {/* Target audience + Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Target audience</span>
              </label>
              <input
                name="targetAudience"
                type="text"
                className="input input-bordered"
                placeholder="e.g. Students, Freelancers"
                value={form.targetAudience}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Estimated budget ($)</span>
              </label>
              <input
                name="estimatedBudget"
                type="number"
                className="input input-bordered"
                placeholder="5000"
                value={form.estimatedBudget}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Tags</span>
              <span className="label-text-alt opacity-50">comma separated</span>
            </label>
            <input
              name="tags"
              type="text"
              className="input input-bordered"
              placeholder="saas, mobile, b2b"
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          {/* Image URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Image URL</span>
            </label>
            <input
              name="imageURL"
              type="url"
              className="input input-bordered"
              placeholder="https://..."
              value={form.imageURL}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? <span className="loading loading-spinner loading-sm" />
              : 'Submit idea'
            }
          </button>

        </form>
      </div>
    </PrivateRoute>
  );
}