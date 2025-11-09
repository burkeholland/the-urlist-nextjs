'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LinkBundleForm from '@/components/LinkBundleForm';
import type { CreateLinkBundleInput } from '@/lib/types';

export default function NewListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [initialData, setInitialData] = useState<CreateLinkBundleInput | undefined>();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    // Check if there's a URL in localStorage from the NewLink component
    const newLinkUrl = localStorage.getItem('newLinkUrl');
    if (newLinkUrl) {
      setInitialData({
        vanity_url: '',
        title: '',
        description: '',
        links: [
          {
            url: newLinkUrl,
            title: '',
            description: '',
            image: '',
            sort_order: 0,
          },
        ],
      });
      // Clear it from localStorage
      localStorage.removeItem('newLinkUrl');
    }
  }, []);

  if (status === 'loading') {
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
          <div className="column is-8">
            <h1 className="title is-2">Create New Link Bundle</h1>
            <p className="subtitle">Share your favorite links with a custom URL</p>
            <LinkBundleForm mode="create" initialData={initialData} />
          </div>
        </div>
      </div>
    </section>
  );
}
