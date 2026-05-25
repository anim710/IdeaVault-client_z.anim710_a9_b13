import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'IdeaVault — Share Startup Ideas',
  description: 'Share, explore, and validate startup ideas with the community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{ duration: 3000 }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}