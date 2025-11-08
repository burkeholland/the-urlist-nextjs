'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import NewLink from '@/components/NewLink';
import { Link } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);

  const handleLinkAdded = (linkData: { url: string; title: string; description: string; image: string }) => {
    const newLink: Link = {
      ...linkData,
      id: crypto.randomUUID(),
    };
    setLinks([...links, newLink]);
    
    // Store in session storage for the new page
    sessionStorage.setItem('newLinks', JSON.stringify([...links, newLink]));
    
    // Navigate to new list page
    router.push('/s/new');
  };

  return (
    <>
      <NavBar />
      <div className="main-background">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column">
                <div id="bannerText">
                  <h1 className="is-size-3 has-text-weight-medium">
                    <span className="has-text-primary">Group</span> links,{' '}
                    <span className="has-text-primary">Save</span> &{' '}
                    <span className="has-text-primary">Share</span> them with the world
                  </h1>
                  <br />
                  <p>Add links to a list and share it with one simple URL.</p>
                  <br />
                  <p>
                    Create a list anonymously or login to save, manage, and edit your
                    lists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="getStarted">
          <div id="homeBottom" className="container">
            <div className="section">
              <h2 className="is-size-3 has-text-weight-bold has-text-primary has-text-centered">
                Get Started
              </h2>
              <NewLink onLinkAdded={handleLinkAdded} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

