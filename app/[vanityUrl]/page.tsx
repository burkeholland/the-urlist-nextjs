'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import LinkBundleItem from '@/components/LinkBundleItem';
import { LinkBundle } from '@/lib/types';

export default function PublicListPage() {
  const params = useParams();
  const [bundle, setBundle] = useState<LinkBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBundle = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/links/${params.vanityUrl}`);
      if (response.ok) {
        const data = await response.json();
        setBundle(data);
      } else {
        setError('List not found');
      }
    } catch (error) {
      console.error('Error fetching bundle:', error);
      setError('Failed to load list');
    } finally {
      setLoading(false);
    }
  }, [params.vanityUrl]);

  useEffect(() => {
    if (params.vanityUrl) {
      fetchBundle();
    }
  }, [params.vanityUrl, fetchBundle]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  if (loading) {
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

  if (error || !bundle) {
    return (
      <>
        <NavBar />
        <div className="section">
          <div className="container has-text-centered">
            <h1 className="title has-text-danger">{error || 'List not found'}</h1>
            <p>The list you&apos;re looking for doesn&apos;t exist.</p>
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
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <div>
                  <h2 className="is-size-3 has-text-primary has-text-weight-medium">
                    {bundle.vanityUrl}
                  </h2>
                  {bundle.description && (
                    <p className="subtitle mt-2">{bundle.description}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button className="button is-primary" onClick={handleCopyLink}>
                  <span className="icon">
                    <i className="fas fa-share"></i>
                  </span>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="has-text-weight-medium mb-4">
              {bundle.links.length} {bundle.links.length === 1 ? 'Link' : 'Links'}
            </p>
            {bundle.links.map((link) => (
              <LinkBundleItem key={link.id} link={link} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
