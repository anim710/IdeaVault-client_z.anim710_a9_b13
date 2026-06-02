import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-base-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/ideavault-logo.png"
              alt="IdeaVault Logo"
              className="h-15 w-auto object-contain"
            />
           
          </Link>
          <p className="text-sm opacity-60 leading-relaxed">
            Where innovation begins. Share your startup idea and get real
            feedback from the community.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li>
              <Link href="/ideas" className="hover:text-primary transition-colors">
                All Ideas
              </Link>
            </li>
            <li>
              <Link href="/add-idea" className="hover:text-primary transition-colors">
                Submit an Idea
              </Link>
            </li>
            <li>
              <Link href="/my-ideas" className="hover:text-primary transition-colors">
                My Ideas
              </Link>
            </li>
            <li>
              <Link href="/my-interactions" className="hover:text-primary transition-colors">
                My Interactions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <p className="text-sm opacity-70">📧 hello@ideavault.com</p>
          <div className="flex gap-4 mt-4 text-sm opacity-70">
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">𝕏</a>
          </div>
        </div>

      </div>
      <div className="text-center py-4 text-xs opacity-40 border-t border-base-300">
        © {new Date().getFullYear()} IdeaVault. All rights reserved.
      </div>
    </footer>
  );
}