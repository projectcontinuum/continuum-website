import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Features from './components/Features';
import SneakPeek from './components/SneakPeek';
import Footer from './components/Footer';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Contribute', href: '#contribute' },
] as const;

const GITHUB_ORG_HREF = 'https://github.com/projectcontinuum';

function useTheme() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark'),
  );

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { isDark, toggle };
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-base/95 backdrop-blur-sm">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        <a href="/" className="text-gradient text-xl font-bold">
          Continuum
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:text-fg"
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="5" />
                <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <motion.a
            href={GITHUB_ORG_HREF}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-on-accent transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base"
          >
            Star on GitHub
          </motion.a>
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-fg-muted hover:text-fg"
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="5" />
                <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-fg-muted hover:text-fg"
          >
            <span className="sr-only">Toggle menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-divider md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={GITHUB_ORG_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-accent px-5 py-2 text-center text-sm font-semibold text-on-accent"
              >
                Star on GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <SneakPeek />
    </>
  );
}

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" role="main">
        <Routes>
          <Route path="/*" element={<LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
