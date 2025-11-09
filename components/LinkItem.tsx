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
      <div className="box link">
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
    <div className="card link">
      <div className="card-content">
        <div className="media">
          {link.image ? (
            <div className="media-left link-image">
              <figure className="image is-64x64">
                <img 
                  src={link.image} 
                  alt={link.title || 'Link image'}
                  style={{ objectFit: 'cover', width: '64px', height: '64px' }}
                />
              </figure>
            </div>
          ) : (
            <div className="media-left link-image">
              <figure className="image is-64x64">
                <img 
                  src="/images/no-image.svg" 
                  alt="No image"
                  style={{ width: '64px', height: '64px' }}
                />
              </figure>
            </div>
          )}
          <div className="media-content link-details">
            <p className="title is-5 link-title">
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title || link.url}
              </a>
            </p>
            {link.description && (
              <p className="subtitle is-6 link-description">{link.description}</p>
            )}
            <p className="link-url">{link.url}</p>
          </div>
          {editable && (
            <div className="media-right">
              <button className="button is-small" onClick={() => setIsEditing(true)}>
                <span className="icon">
                  <i className="fas fa-edit"></i>
                </span>
              </button>
              {onDelete && (
                <button className="button is-small is-danger ml-2" onClick={onDelete}>
                  <span className="icon">
                    <i className="fas fa-trash"></i>
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
