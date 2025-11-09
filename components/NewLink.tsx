'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface NewLinkProps {
  onNewLinkAdded?: (url: string) => void;
}

export default function NewLink({ onNewLinkAdded }: NewLinkProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validateUrl = (url: string): boolean => {
    if (!url || url.trim() === '') {
      return false;
    }

    let testUrl = url;
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      testUrl = 'http://' + testUrl;
    }

    try {
      const urlObj = new URL(testUrl);
      const isHttp = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      const hostParts = urlObj.hostname.replace('www.', '').split('.');
      const hasValidHost = hostParts.length > 1 && 
                          urlObj.hostname.length > urlObj.hostname.lastIndexOf('.') + 1;
      
      return isHttp && hasValidHost;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateUrl(linkUrl)) {
      setInvalid(true);
      return;
    }

    setInvalid(false);

    // Store the link URL in localStorage for the new page to pick up
    if (typeof window !== 'undefined') {
      const normalizedUrl = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') 
        ? linkUrl 
        : 'http://' + linkUrl;
      
      localStorage.setItem('newLinkUrl', normalizedUrl);
    }

    // Navigate to the /s/new route
    router.push('/s/new');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <p>Enter a link and press enter</p>
      <input
        ref={inputRef}
        id="newLink"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="http://example.com"
        className="input is-large is-size-2 modified"
        autoComplete="off"
      />
      <div className={`is-font-weight-medium mt-2 ${invalid ? 'has-text-danger' : 'is-hidden'}`}>
        That doesn&apos;t look like a valid URL
      </div>
    </form>
  );
}
