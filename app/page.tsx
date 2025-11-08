'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  return (
    <section className="hero is-fullheight-with-navbar">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title is-1">
            Welcome to The URList
          </h1>
          <p className="subtitle is-3">
            Share your favorite links with the world
          </p>
          <div className="content">
            <p className="is-size-5">
              Create beautiful link collections and share them with a custom vanity URL.
              Perfect for sharing resources, portfolios, or your favorite content.
            </p>
          </div>
          <div className="buttons is-centered mt-5">
            {session ? (
              <>
                <Link href="/s/new" className="button is-primary is-large">
                  Create New List
                </Link>
                <Link href="/s/mylists" className="button is-light is-large">
                  View My Lists
                </Link>
              </>
            ) : (
              <Link href="/api/auth/signin" className="button is-primary is-large">
                Get Started
              </Link>
            )}
          </div>
          
          <div className="section">
            <div className="columns is-centered">
              <div className="column is-4">
                <div className="box">
                  <h3 className="title is-4">📝 Easy to Create</h3>
                  <p>Add links, titles, and descriptions with our simple form.</p>
                </div>
              </div>
              <div className="column is-4">
                <div className="box">
                  <h3 className="title is-4">🔗 Custom URLs</h3>
                  <p>Choose your own vanity URL to make sharing easy.</p>
                </div>
              </div>
              <div className="column is-4">
                <div className="box">
                  <h3 className="title is-4">📱 QR Codes</h3>
                  <p>Generate QR codes for your lists to share offline.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
