'use client';

import { useState } from 'react';

interface NewLinkProps {
  onLinkAdded: (link: { url: string; title: string; description: string; image: string }) => void;
}

export default function NewLink({ onLinkAdded }: NewLinkProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;

    setLoading(true);

    try {
      // Fetch OpenGraph metadata
      const response = await fetch(`/api/opengraph?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      onLinkAdded({
        url: data.url || url,
        title: data.title || url,
        description: data.description || '',
        image: data.image || '',
      });

      setUrl('');
    } catch (error) {
      console.error('Error fetching link metadata:', error);
      // Still add the link even if metadata fetch fails
      onLinkAdded({
        url,
        title: url,
        description: '',
        image: '',
      });
      setUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field has-addons">
        <div className="control is-expanded">
          <input
            className="input is-medium"
            type="url"
            placeholder="Enter a URL to get started..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="control">
          <button
            type="submit"
            className={`button is-primary is-medium ${loading ? 'is-loading' : ''}`}
            disabled={loading || !url.trim()}
          >
            Add Link
          </button>
        </div>
      </div>
    </form>
  );
}
