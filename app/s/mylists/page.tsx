'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { LinkBundleWithLinks } from '@/lib/types';

export default function MyListsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bundles, setBundles] = useState<LinkBundleWithLinks[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchBundles();
    }
  }, [session]);

  const fetchBundles = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setBundles(data.bundles);
      }
    } catch (error) {
      console.error('Failed to fetch bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vanityUrl: string) => {
    if (!confirm('Are you sure you want to delete this list?')) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${vanityUrl}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBundles(bundles.filter(b => b.vanity_url !== vanityUrl));
      }
    } catch (error) {
      console.error('Failed to delete bundle:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="has-text-centered">
            <progress className="progress is-primary" max="100">Loading...</progress>
          </div>
        </div>
      </section>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-10">
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  <h1 className="title is-2">My Lists</h1>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <Link href="/s/new" className="button is-primary">
                    Create New List
                  </Link>
                </div>
              </div>
            </div>

            {bundles.length === 0 ? (
              <div className="notification">
                <p>You haven&apos;t created any lists yet.</p>
                <Link href="/s/new" className="button is-primary mt-3">
                  Create Your First List
                </Link>
              </div>
            ) : (
              <div className="columns is-multiline">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="column is-6">
                    <div className="card">
                      <div className="card-content">
                        <p className="title is-4">
                          {bundle.title || 'Untitled'}
                        </p>
                        <p className="subtitle is-6">
                          /{bundle.vanity_url}
                        </p>
                        {bundle.description && (
                          <div className="content">
                            {bundle.description}
                          </div>
                        )}
                        <div className="content">
                          <small className="has-text-grey">
                            {bundle.links?.length || 0} link(s)
                          </small>
                        </div>
                      </div>
                      <footer className="card-footer">
                        <Link
                          href={`/${bundle.vanity_url}`}
                          className="card-footer-item"
                        >
                          View
                        </Link>
                        <Link
                          href={`/s/edit/${bundle.id}`}
                          className="card-footer-item"
                        >
                          Edit
                        </Link>
                        <a
                          className="card-footer-item has-text-danger"
                          onClick={() => handleDelete(bundle.vanity_url)}
                        >
                          Delete
                        </a>
                      </footer>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
