'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function NavBar() {
  const { data: session } = useSession();
  const [isActive, setIsActive] = useState(false);

  return (
    <header id="navbar" className="header">
      <nav className="navbar container" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link href="/" className="navbar-item">
            <img 
              id="logo-img" 
              className="mt-4" 
              width="100" 
              height="60" 
              src="/images/logo.svg" 
              alt="urlist logo" 
            />
          </Link>
          <a
            role="button"
            className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
            style={{ marginTop: '20px' }}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setIsActive(!isActive)}
          >
            <img src="/images/burger.svg" alt="toggle menu" width="60" height="60" />
          </a>
        </div>

        <div className={`navbar-menu ${isActive ? 'is-active' : ''}`} style={{ marginTop: '20px' }}>
          <div className="navbar-start">
            <Link href="/s/new" className="navbar-item">
              <span className="icon is-large navbar-icon">
                <i className="fas fa-lg fa-plus-circle"></i>
              </span>
              New
            </Link>
            {session && (
              <Link href="/s/mylists" className="navbar-item">
                <span className="icon is-large navbar-icon">
                  <i className="fas fa-lg fa-user-circle"></i>
                </span>
                My Lists
              </Link>
            )}
            <a href="https://aka.ms/theurlist" className="navbar-item" target="_blank" rel="noopener noreferrer">
              <span className="icon is-large navbar-icon">
                <i className="fas fa-lg fa-question-circle"></i>
              </span>
              About
            </a>
            <Link href="/s/terms" className="navbar-item">
              <span className="icon is-large navbar-icon">
                <i className="fas fa-lg fa-info"></i>
              </span>
              Terms
            </Link>
          </div>

          <div className="navbar-end">
            <ThemeSwitcher />
            {session ? (
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">
                  <div className="columns is-gapless is-mobile is-vcentered">
                    <div className="column is-narrow">
                      <figure id="profileImage" className="image">
                        {session.user?.image && (
                          <img 
                            className="is-rounded" 
                            src={session.user.image} 
                            alt={session.user.name || 'User'} 
                          />
                        )}
                      </figure>
                    </div>
                    <div className="column">
                      <span>{session.user?.name || session.user?.email}</span>
                    </div>
                  </div>
                </a>
                <div className="navbar-dropdown">
                  <a className="navbar-item" onClick={() => signOut()} style={{ cursor: 'pointer' }}>
                    <span className="icon is-medium navbar-icon">
                      <i className="fas fa-sign-out-alt"></i>
                    </span>
                    Log Out
                  </a>
                </div>
              </div>
            ) : (
              <a className="navbar-item" onClick={() => signIn()} style={{ cursor: 'pointer' }}>
                <span className="icon is-large navbar-icon">
                  <i className="fas fa-lg fa-sign-in-alt"></i>
                </span>
                Login
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
