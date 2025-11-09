'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import NewLink from '@/components/NewLink';

export default function Home() {
  const { data: session } = useSession();

  return (
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
                  Create a list anonymously or login to save, manage, and edit your lists.
                </p>
              </div>
            </div>
            <div className="column is-half is-hidden-mobile">
              <img 
                loading="lazy" 
                src="/images/banner-logo-large.svg" 
                className="banner-image" 
                alt="banner" 
                width="500" 
                height="500" 
              />
            </div>
          </div>
        </div>
      </div>
      <div id="getStarted">
        <div id="homeBottomBackground"></div>
        <div id="homeBottom" className="container">
          <div className="section">
            <h2 className="is-size-3 has-text-weight-bold has-text-primary has-text-centered">
              Get Started
            </h2>
            <NewLink />
          </div>
        </div>
      </div>
    </div>
  );
}
