'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import NewLink from '@/components/NewLink';
import LinkBundleItem from '@/components/LinkBundleItem';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from '@/lib/types';

export default function EditListPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [vanityUrl, setVanityUrl] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchBundle = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/links/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setVanityUrl(data.vanityUrl);
        setDescription(data.description);
        setLinks(data.links);
      } else {
        alert('Failed to load list');
        router.push('/s/mylists');
      }
    } catch (error) {
      console.error('Error fetching bundle:', error);
      alert('Failed to load list');
      router.push('/s/mylists');
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user && params.id) {
      fetchBundle();
    }
  }, [user, authLoading, params.id, router, fetchBundle]);

  const handleLinkAdded = (linkData: { url: string; title: string; description: string; image: string }) => {
    const newLink: Link = {
      ...linkData,
      id: crypto.randomUUID(),
    };
    setLinks([...links, newLink]);
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks(links.filter((link) => link.id !== linkId));
  };

  const handleSave = async () => {
    if (links.length === 0) {
      alert('Please add at least one link');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/links/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vanityUrl,
          description,
          links,
        }),
      });

      if (response.ok) {
        alert('List updated successfully');
        router.push('/s/mylists');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update list');
      }
    } catch (error) {
      console.error('Error updating list:', error);
      alert('Failed to update list');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this list?')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/links/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/s/mylists');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete list');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Failed to delete list');
    } finally {
      setDeleting(false);
    }
  };

  if (loading || authLoading || !user) {
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

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="section">
          <h2 className="is-size-3 has-text-primary has-text-weight-medium">
            Edit List
          </h2>

          <div className="box mt-4">
            <div className="field">
              <label className="label">Custom URL</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={vanityUrl}
                  onChange={(e) => setVanityUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="box mt-4">
            <h3 className="is-size-5 has-text-weight-medium mb-4">Add More Links</h3>
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
              disabled={saving || links.length === 0}
            >
              Save Changes
            </button>
            <button
              className={`button is-danger is-medium ${deleting ? 'is-loading' : ''}`}
              onClick={handleDelete}
              disabled={deleting}
            >
              Delete List
            </button>
            <button
              className="button is-light is-medium"
              onClick={() => router.push('/s/mylists')}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
