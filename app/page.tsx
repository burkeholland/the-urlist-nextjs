'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

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
                <br />
                <div className="buttons">
                  {session ? (
                    <>
                      <Link href="/s/new" className="button is-primary">
                        Create New List
                      </Link>
                      <Link href="/s/mylists" className="button is-light">
                        View My Lists
                      </Link>
                    </>
                  ) : (
                    <Link href="/api/auth/signin" className="button is-primary">
                      Get Started
                    </Link>
                  )}
                </div>
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
    </div>
  );
}
