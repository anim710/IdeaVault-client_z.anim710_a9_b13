'use client';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api';
import IdeaCard from '@/components/IdeaCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const CATEGORIES = ['All', 'Tech', 'Health', 'AI', 'Education', 'Finance', 'Other'];

export default function IdeasPage() {
  const [ideas, setIdeas]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');

  const fetchIdeas = async (searchVal = search, categoryVal = category) => {
    setLoading(true);
    try {
      const params = {};
      if (searchVal) params.search = searchVal;
      if (categoryVal !== 'All') params.category = categoryVal;
      const res = await publicApi.get('/ideas', { params });
      setIdeas(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  // Fetch on category change immediately
  useEffect(() => { fetchIdeas(search, category); }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIdeas(search, category);
  };

  const handleClear = () => {
    setSearch('');
    setCategory('All');
    fetchIdeas('', 'All');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <h1 className="text-4xl font-bold mb-1">All Ideas</h1>
      <p className="text-base-content/60 mb-8">
        Explore innovative startup ideas from the community
      </p>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Search ideas by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {(search || category !== 'All') && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClear}
            >
              Clear
            </button>
          )}
        </form>

        <select
          className="select select-bordered"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : ideas.length === 0 ? (
        <div className="text-center py-24 text-base-content/50">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No ideas found. Try a different search.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-base-content/50 mb-4">
            {ideas.length} idea{ideas.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}