'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function NavBar() {
  const { user, loading, signInWithProvider, signOut } = useAuth();

  return (
    <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link href="/" className="navbar-item">
            <strong>The URList</strong>
          </Link>
        </div>

        <div className="navbar-menu">
          <div className="navbar-end">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/s/mylists" className="navbar-item">
                      My Lists
                    </Link>
                    <div className="navbar-item">
                      <div className="buttons">
                        <button className="button is-light" onClick={signOut}>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="navbar-item">
                    <div className="buttons">
                      <button
                        className="button is-light"
                        onClick={() => signInWithProvider('github')}
                      >
                        Sign In with GitHub
                      </button>
                      <button
                        className="button is-light"
                        onClick={() => signInWithProvider('google')}
                      >
                        Sign In with Google
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
