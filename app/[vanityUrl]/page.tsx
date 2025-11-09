import { notFound } from 'next/navigation';
import LinkItem from '@/components/LinkItem';
import type { Link } from '@/lib/types';

async function getLinkBundle(vanityUrl: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/links/${vanityUrl}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export default async function SharePage({ params }: { params: Promise<{ vanityUrl: string }> }) {
  const { vanityUrl } = await params;
  const bundle = await getLinkBundle(vanityUrl);

  if (!bundle) {
    notFound();
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-8">
            <h1 className="title is-2">{bundle.title || 'Link Bundle'}</h1>
            {bundle.description && (
              <p className="subtitle">{bundle.description}</p>
            )}
            
            <div className="box">
              <p className="has-text-grey">
                <strong>Share this list:</strong> {typeof window !== 'undefined' ? window.location.href : ''}
              </p>
            </div>

            <div className="mt-5">
              {bundle.links && bundle.links.length > 0 ? (
                bundle.links.map((link: Link) => (
                  <LinkItem key={link.id} link={link} />
                ))
              ) : (
                <div className="notification">
                  No links in this bundle yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
