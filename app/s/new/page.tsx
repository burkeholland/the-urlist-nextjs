'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import NewLink from '@/components/NewLink';
import LinkBundleItem from '@/components/LinkBundleItem';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from '@/lib/types';

export default function NewListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [links, setLinks] = useState<Link[]>([]);
  const [vanityUrl, setVanityUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load links from session storage if available
    const storedLinks = sessionStorage.getItem('newLinks');
    if (storedLinks) {
      try {
        setLinks(JSON.parse(storedLinks));
      } catch (error) {
        console.error('Error parsing stored links:', error);
      }
    }
  }, []);

  const handleLinkAdded = (linkData: { url: string; title: string; description: string; image: string }) => {
    const newLink: Link = {
      ...linkData,
      id: crypto.randomUUID(),
    };
    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    sessionStorage.setItem('newLinks', JSON.stringify(updatedLinks));
  };

  const handleDeleteLink = (linkId: string) => {
    const updatedLinks = links.filter((link) => link.id !== linkId);
    setLinks(updatedLinks);
    sessionStorage.setItem('newLinks', JSON.stringify(updatedLinks));
  };

  const handleSave = async () => {
    if (links.length === 0) {
      alert('Please add at least one link');
      return;
    }

    if (!user) {
      alert('Please sign in to save your list');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vanityUrl: vanityUrl || undefined,
          description,
          links,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.removeItem('newLinks');
        router.push(`/${data.vanityUrl}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save list');
      }
    } catch (error) {
      console.error('Error saving list:', error);
      alert('Failed to save list');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="section">
          <h2 className="is-size-3 has-text-primary has-text-weight-medium">
            Create New List
          </h2>

          <div className="box mt-4">
            <div className="field">
              <label className="label">Custom URL (optional)</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="my-awesome-list"
                  value={vanityUrl}
                  onChange={(e) => setVanityUrl(e.target.value)}
                />
              </div>
              <p className="help">
                Leave blank to generate a random URL
              </p>
            </div>

            <div className="field">
              <label className="label">Description (optional)</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="What is this list about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="box mt-4">
            <h3 className="is-size-5 has-text-weight-medium mb-4">Add Links</h3>
            <NewLink onLinkAdded={handleLinkAdded} />
          </div>

          {links.length > 0 && (
            <div className="mt-4">
              <h3 className="is-size-5 has-text-weight-medium mb-4">
                Links ({links.length})
              </h3>
              {links.map((link) => (
                <LinkBundleItem
                  key={link.id}
                  link={link}
                  editable
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          )}

          <div className="buttons mt-4">
            <button
              className={`button is-primary is-medium ${saving ? 'is-loading' : ''}`}
              onClick={handleSave}
              disabled={saving || links.length === 0 || !user}
            >
              {!user ? 'Sign In to Save' : 'Save List'}
            </button>
            <button
              className="button is-light is-medium"
              onClick={() => router.push('/')}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
