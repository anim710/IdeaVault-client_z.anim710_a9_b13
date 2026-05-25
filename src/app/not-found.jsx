import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Page not found</h2>
      <p className="text-base-content/60 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary">Go home</Link>
    </div>
  );
}