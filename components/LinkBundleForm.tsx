'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateLinkBundleInput, CreateLinkInput } from '@/lib/types';

interface LinkBundleFormProps {
  initialData?: CreateLinkBundleInput;
  mode: 'create' | 'edit';
}

export default function LinkBundleForm({ initialData, mode }: LinkBundleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateLinkBundleInput>(
    initialData || {
      vanity_url: '',
      title: '',
      description: '',
      links: [{ url: '', title: '', description: '', image: '', sort_order: 0 }],
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vanityUrlAvailable, setVanityUrlAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (mode === 'create' && formData.vanity_url) {
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`/api/links/${formData.vanity_url}`);
          setVanityUrlAvailable(response.status === 404);
        } catch {
          setVanityUrlAvailable(null);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.vanity_url, mode]);

  const addLink = () => {
    setFormData({
      ...formData,
      links: [
        ...formData.links,
        { url: '', title: '', description: '', image: '', sort_order: formData.links.length },
      ],
    });
  };

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index),
    });
  };

  const updateLink = (index: number, field: keyof CreateLinkInput, value: string | number) => {
    const newLinks = [...formData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, links: newLinks });
  };

  const fetchMetadata = async (index: number) => {
    const link = formData.links[index];
    if (!link.url) return;

    try {
      const response = await fetch('/api/oginfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link.url }),
      });

      if (response.ok) {
        const metadata = await response.json();
        const newLinks = [...formData.links];
        newLinks[index] = {
          ...newLinks[index],
          title: metadata.title || newLinks[index].title,
          description: metadata.description || newLinks[index].description,
          image: metadata.image || newLinks[index].image,
        };
        setFormData({ ...formData, links: newLinks });
      }
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = mode === 'create' ? '/api/links' : `/api/links/${initialData?.vanity_url}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save link bundle');
      }

      const bundle = await response.json();
      router.push(`/${bundle.vanity_url}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Vanity URL *</label>
        <div className="control">
          <input
            className={`input ${vanityUrlAvailable === false ? 'is-danger' : vanityUrlAvailable === true ? 'is-success' : ''}`}
            type="text"
            value={formData.vanity_url}
            onChange={(e) => setFormData({ ...formData, vanity_url: e.target.value })}
            disabled={mode === 'edit'}
            required
          />
        </div>
        {vanityUrlAvailable === false && (
          <p className="help is-danger">This vanity URL is already taken</p>
        )}
      </div>

      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Description</label>
        <div className="control">
          <textarea
            className="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>

      <hr />

      <h3 className="title is-4">Links</h3>

      {formData.links.map((link, index) => (
        <div key={index} className="box">
          <div className="field">
            <label className="label">URL *</label>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  className="input"
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  required
                />
              </div>
              <div className="control">
                <button
                  type="button"
                  className="button is-info"
                  onClick={() => fetchMetadata(index)}
                >
                  Fetch Info
                </button>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={link.title}
                onChange={(e) => updateLink(index, 'title', e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                value={link.description}
                onChange={(e) => updateLink(index, 'description', e.target.value)}
              />
            </div>
          </div>

          {formData.links.length > 1 && (
            <button
              type="button"
              className="button is-danger is-small"
              onClick={() => removeLink(index)}
            >
              Remove Link
            </button>
          )}
        </div>
      ))}

      <button type="button" className="button is-light mb-4" onClick={addLink}>
        Add Another Link
      </button>

      {error && (
        <div className="notification is-danger">
          {error}
        </div>
      )}

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={`button is-primary ${loading ? 'is-loading' : ''}`}
            disabled={loading || (mode === 'create' && vanityUrlAvailable === false)}
          >
            {mode === 'create' ? 'Create List' : 'Update List'}
          </button>
        </div>
        <div className="control">
          <button
            type="button"
            className="button is-light"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
