import Link from 'next/link';

export default function IdeaCard({ idea }) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 border border-base-200 flex flex-col">
      {idea.imageURL && (
        <figure className="h-44 overflow-hidden">
          <img
            src={idea.imageURL}
            alt={idea.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x200?text=IdeaVault';
            }}
          />
        </figure>
      )}
      <div className="card-body p-5 flex flex-col flex-1">
        <span className="badge badge-primary badge-outline text-xs w-fit">
          {idea.category}
        </span>
        <h2 className="card-title text-base mt-2 line-clamp-2">{idea.title}</h2>
        <p className="text-sm text-base-content/70 line-clamp-2 flex-1">
          {idea.shortDescription}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <div className="avatar">
            <div className="w-6 rounded-full">
              <img
                src={idea.authorPhoto || 'https://placehold.co/40?text=U'}
                alt={idea.authorName}
              />
            </div>
          </div>
          <span className="text-xs text-base-content/60">{idea.authorName}</span>
          <span className="text-xs text-base-content/40 ml-auto">
            {new Date(idea.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Link
          href={`/ideas/${idea._id}`}
          className="btn btn-primary btn-sm mt-3 w-full"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}