'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from './ThemeContext';

export default function NavBar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [isActive, setIsActive] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/" className="navbar-item">
          <strong>The URList</strong>
        </Link>

        <a
          role="button"
          className={`navbar-burger ${isActive ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded="false"
          onClick={() => setIsActive(!isActive)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-start">
          {session && (
            <>
              <Link href="/s/new" className="navbar-item">
                New List
              </Link>
              <Link href="/s/mylists" className="navbar-item">
                My Lists
              </Link>
            </>
          )}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <button
              className="button is-light"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
          <div className="navbar-item">
            <div className="buttons">
              {session ? (
                <>
                  <span className="navbar-item">
                    Hello, {session.user?.name || session.user?.email}
                  </span>
                  <button
                    className="button is-light"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  className="button is-primary"
                  onClick={() => signIn()}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
