'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { LinkBundle } from '@/lib/types';

export default function MyListsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [linkBundles, setLinkBundles] = useState<LinkBundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      fetchLinkBundles();
    }
  }, [user, authLoading, router]);

  const fetchLinkBundles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setLinkBundles(data);
      }
    } catch (error) {
      console.error('Error fetching link bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewList = () => {
    sessionStorage.removeItem('newLinks');
    router.push('/s/new');
  };

  const handleEditList = (bundle: LinkBundle) => {
    router.push(`/s/edit/${bundle.id}`);
  };

  if (authLoading || !user) {
    return (
      <>
        <NavBar />
        <div className="section">
          <div className="container has-text-centered">
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="section">
          <h2 className="is-size-3 has-text-primary has-text-weight-medium">My Lists</h2>
          <div className="columns is-multiline">
            <div className="column is-one-quarter-widescreen is-one-third-desktop is-half-tablet">
              <div
                className="card"
                onClick={handleNewList}
                style={{ cursor: 'pointer', minHeight: '200px' }}
              >
                <div className="card-content has-text-centered">
                  <div className="content">
                    <p className="is-size-1">+</p>
                    <p className="has-text-weight-medium">Create new list</p>
                  </div>
                </div>
              </div>
            </div>
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="column is-one-quarter-widescreen is-one-third-desktop is-half-tablet"
                  >
                    <div className="card" style={{ minHeight: '200px' }}>
                      <div className="card-content">
                        <div className="content">Loading...</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {linkBundles.map((bundle) => (
                  <div
                    key={bundle.id}
                    className="column is-one-quarter-widescreen is-one-third-desktop is-half-tablet"
                  >
                    <div
                      className="card"
                      onClick={() => handleEditList(bundle)}
                      style={{ cursor: 'pointer', minHeight: '200px' }}
                    >
                      <div className="card-content">
                        <div className="content">
                          <span className="tag is-primary">
                            {bundle.links.length} Links
                          </span>
                          <h3 className="is-size-5 has-text-weight-medium mt-2">
                            {bundle.vanityUrl}
                          </h3>
                          <p className="is-size-6">{bundle.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
