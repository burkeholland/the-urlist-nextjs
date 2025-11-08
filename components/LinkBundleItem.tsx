'use client';

import { Link } from '@/lib/types';

interface LinkBundleItemProps {
  link: Link;
  onEdit?: (link: Link) => void;
  onDelete?: (linkId: string) => void;
  editable?: boolean;
}

export default function LinkBundleItem({
  link,
  onEdit,
  onDelete,
  editable = false,
}: LinkBundleItemProps) {
  return (
    <div className="box">
      <article className="media">
        {link.image && (
          <div className="media-left">
            <figure className="image is-64x64">
              <img src={link.image} alt={link.title} />
            </figure>
          </div>
        )}
        <div className="media-content">
          <div className="content">
            <p>
              <strong>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.title}
                </a>
              </strong>
              <br />
              {link.description && <small>{link.description}</small>}
              <br />
              <small className="has-text-grey">{link.url}</small>
            </p>
          </div>
        </div>
        {editable && (
          <div className="media-right">
            <div className="buttons">
              {onEdit && (
                <button className="button is-small" onClick={() => onEdit(link)}>
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  className="button is-small is-danger"
                  onClick={() => onDelete(link.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
