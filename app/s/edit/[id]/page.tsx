'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import LinkBundleForm from '@/components/LinkBundleForm';
import type { LinkBundleWithLinks, CreateLinkBundleInput } from '@/lib/types';

export default function EditListPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = use(params);
  const [bundle, setBundle] = useState<LinkBundleWithLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session && id) {
      fetchBundle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, id]);

  const fetchBundle = async () => {
    try {
      // We need to fetch by ID, but our API uses vanity URL
      // For now, fetch all bundles and find the one with matching ID
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        const foundBundle = data.bundles.find((b: LinkBundleWithLinks) => b.id === id);
        
        if (foundBundle) {
          setBundle(foundBundle);
        } else {
          setError('Bundle not found');
        }
      }
    } catch (error) {
      console.error('Failed to fetch bundle:', error);
      setError('Failed to load bundle');
    } finally {
      setLoading(false);
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

  if (error || !bundle) {
    return (
      <section className="section">
        <div className="container">
          <div className="notification is-danger">
            {error || 'Bundle not found'}
          </div>
        </div>
      </section>
    );
  }

  const initialData: CreateLinkBundleInput = {
    vanity_url: bundle.vanity_url,
    title: bundle.title || '',
    description: bundle.description || '',
    links: bundle.links.map((link, index) => ({
      url: link.url,
      title: link.title || '',
      description: link.description || '',
      image: link.image || '',
      sort_order: index,
    })),
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-8">
            <h1 className="title is-2">Edit Link Bundle</h1>
            <p className="subtitle">Update your link collection</p>
            <LinkBundleForm
              mode="edit"
              initialData={initialData}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
