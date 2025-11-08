'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Link } from '@/lib/types';

interface LinkItemProps {
  link: Link;
  editable?: boolean;
  onUpdate?: (link: Partial<Link>) => void;
  onDelete?: () => void;
}

export default function LinkItem({ link, editable = false, onUpdate, onDelete }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLink, setEditedLink] = useState(link);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedLink);
    }
    setIsEditing(false);
  };

  if (isEditing && editable) {
    return (
      <div className="box">
        <div className="field">
          <label className="label">URL</label>
          <div className="control">
            <input
              className="input"
              type="url"
              value={editedLink.url}
              onChange={(e) => setEditedLink({ ...editedLink, url: e.target.value })}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={editedLink.title || ''}
              onChange={(e) => setEditedLink({ ...editedLink, title: e.target.value })}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <textarea
              className="textarea"
              value={editedLink.description || ''}
              onChange={(e) => setEditedLink({ ...editedLink, description: e.target.value })}
            />
          </div>
        </div>
        <div className="buttons">
          <button className="button is-primary" onClick={handleSave}>
            Save
          </button>
          <button className="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="box">
      <article className="media">
        {link.image && (
          <figure className="media-left">
            <div className="image is-64x64" style={{ position: 'relative' }}>
              <Image
                src={link.image}
                alt={link.title || 'Link image'}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </figure>
        )}
        <div className="media-content">
          <div className="content">
            <p>
              <strong>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.title || link.url}
                </a>
              </strong>
              <br />
              {link.description && <span>{link.description}</span>}
              <br />
              <small className="has-text-grey">{link.url}</small>
            </p>
          </div>
        </div>
        {editable && (
          <div className="media-right">
            <button className="button is-small" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            {onDelete && (
              <button className="button is-small is-danger ml-2" onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
