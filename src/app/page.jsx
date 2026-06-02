'use client';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api';
import IdeaCard from '@/components/IdeaCard';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';

const slides = [
  {
    title: 'Turn your idea into reality',
    sub: 'Share your startup concept and get real feedback from innovators worldwide.',
    bg: 'from-purple-600 to-blue-500',
  },
  {
    title: 'Validate before you build',
    sub: 'Community-driven validation helps you spot winners before spending a dollar.',
    bg: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Connect with builders',
    sub: 'Find collaborators, co-founders, and early adopters right here.',
    bg: 'from-orange-500 to-pink-600',
  },
];

const steps = [
  {
    icon: '💡',
    title: 'Post your idea',
    desc: 'Fill in a simple form describing your startup concept, problem, and solution.',
  },
  {
    icon: '🌍',
    title: 'Get community feedback',
    desc: 'Others comment, validate, and help you refine your concept.',
  },
  {
    icon: '🚀',
    title: 'Build with confidence',
    desc: 'Use real feedback to decide whether to move forward and ship your product.',
  },
];

export default function HomePage() {
    const { user } = useAuth();
  const [slide, setSlide]               = useState(0);
  const [trending, setTrending]         = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // Auto-advance banner every 4.5 seconds
  useEffect(() => {
    const t = setInterval(
      () => setSlide((s) => (s + 1) % slides.length),
      4500
    );
    return () => clearInterval(t);
  }, []);

  // Fetch trending ideas
  useEffect(() => {
    publicApi
      .get('/ideas/trending')
      .then((res) => setTrending(res.data))
      .catch(() => {})
      .finally(() => setTrendingLoading(false));
  }, []);

  return (
    <div>

      {/* ── Banner ── */}
      <section
        className={`bg-gradient-to-br ${slides[slide].bg} text-white
          min-h-[440px] flex flex-col items-center justify-center
          text-center px-6 py-24 transition-all duration-700`}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl leading-tight">
          {slides[slide].title}
        </h1>
        <p className="text-lg md:text-xl opacity-90 max-w-xl mb-10">
          {slides[slide].sub}
        </p>
        <Link
          href="/ideas"
          className="btn btn-lg bg-white text-primary border-0 hover:bg-white/90 font-semibold"
        >
          Explore Ideas →
        </Link>

        {/* Slide dots */}
        <div className="flex gap-2 mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === slide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Trending ideas ── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Trending ideas</h2>
            <p className="text-base-content/60 mt-1">
              Latest concepts from the community
            </p>
          </div>
          <Link href="/ideas" className="btn btn-outline btn-sm">
            See all →
          </Link>
        </div>

        {trendingLoading ? (
          <LoadingSpinner />
        ) : trending.length === 0 ? (
          <p className="text-center text-base-content/50 py-10">
            No ideas posted yet. Be the first!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        )}
      </section>

      {/* ── How it works ── */}
      <section className="bg-base-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How IdeaVault works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.title} className="card bg-base-100 p-6 shadow-sm">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-base-content/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-4xl mx-auto px-4 py-20">
  {user ? (
    <div className="bg-base-200 rounded-3xl p-10 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ready to launch your next idea?
      </h2>

      <p className="text-base-content/60 mb-8 max-w-2xl mx-auto">
        Share a startup concept, collect feedback, and validate your next big thing.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/add-idea" className="btn btn-primary btn-lg">
          + Post New Idea
        </Link>

        <Link href="/ideas" className="btn btn-outline btn-lg">
          Go to Dashboard
        </Link>
      </div>
    </div>
  ) : (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ready to share your idea?
      </h2>

      <p className="text-base-content/60 mb-8">
        Join thousands of builders validating startup ideas on IdeaVault.
      </p>

      <Link href="/register" className="btn btn-primary btn-lg">
        Get started free
      </Link>
    </div>
  )}
</section>

    </div>
  );
}