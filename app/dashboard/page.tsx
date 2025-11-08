'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

interface Link {
  id: string
  url: string
  title: string
  description?: string
  createdAt: string
}

interface Bundle {
  id: string
  name: string
  description?: string
  links: Link[]
  createdAt: string
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [loading, setLoading] = useState(true)
  const [showBundleModal, setShowBundleModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null)
  const [bundleName, setBundleName] = useState('')
  const [bundleDescription, setBundleDescription] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const [linkDescription, setLinkDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchBundles()
    }
  }, [user])

  const fetchBundles = async () => {
    try {
      const response = await fetch('/api/bundles')
      if (response.ok) {
        const data = await response.json()
        setBundles(data)
      }
    } catch (err) {
      console.error('Error fetching bundles:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBundle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/bundles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: bundleName, description: bundleDescription }),
      })

      if (response.ok) {
        setBundleName('')
        setBundleDescription('')
        setShowBundleModal(false)
        fetchBundles()
      } else {
        setError('Failed to create bundle')
      }
    } catch {
      setError('An error occurred')
    }
  }

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedBundle) return

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: linkUrl,
          title: linkTitle,
          description: linkDescription,
          bundleId: selectedBundle,
        }),
      })

      if (response.ok) {
        setLinkUrl('')
        setLinkTitle('')
        setLinkDescription('')
        setShowLinkModal(false)
        setSelectedBundle(null)
        fetchBundles()
      } else {
        setError('Failed to create link')
      }
    } catch {
      setError('An error occurred')
    }
  }

  const handleDeleteBundle = async (bundleId: string) => {
    if (!confirm('Are you sure you want to delete this bundle and all its links?')) return

    try {
      const response = await fetch(`/api/bundles/${bundleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBundles()
      }
    } catch (err) {
      console.error('Error deleting bundle:', err)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBundles()
      }
    } catch (err) {
      console.error('Error deleting link:', err)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || loading) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <nav className="navbar is-primary">
        <div className="container">
          <div className="navbar-brand">
            <div className="navbar-item">
              <h1 className="title is-4 has-text-white">The URList</h1>
            </div>
          </div>
          <div className="navbar-menu is-active">
            <div className="navbar-end">
              <div className="navbar-item">
                <span className="has-text-white mr-4">{user.email}</span>
                <button className="button is-light" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="section">
        <div className="container">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <h2 className="title is-3">My Bundles</h2>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button
                  className="button is-primary"
                  onClick={() => setShowBundleModal(true)}
                >
                  Create Bundle
                </button>
              </div>
            </div>
          </div>

          {bundles.length === 0 ? (
            <div className="notification is-info is-light">
              <p>No bundles yet. Create your first bundle to get started!</p>
            </div>
          ) : (
            <div className="columns is-multiline">
              {bundles.map((bundle) => (
                <div key={bundle.id} className="column is-12">
                  <div className="card">
                    <header className="card-header">
                      <p className="card-header-title">{bundle.name}</p>
                      <button
                        className="card-header-icon"
                        onClick={() => handleDeleteBundle(bundle.id)}
                      >
                        <span className="icon">
                          <i className="delete"></i>
                        </span>
                      </button>
                    </header>
                    <div className="card-content">
                      {bundle.description && <p className="mb-4">{bundle.description}</p>}
                      
                      <div className="buttons">
                        <button
                          className="button is-small is-primary"
                          onClick={() => {
                            setSelectedBundle(bundle.id)
                            setShowLinkModal(true)
                          }}
                        >
                          Add Link
                        </button>
                      </div>

                      {bundle.links.length === 0 ? (
                        <p className="has-text-grey-light">No links in this bundle yet.</p>
                      ) : (
                        <div className="content">
                          {bundle.links.map((link) => (
                            <div key={link.id} className="box">
                              <div className="level is-mobile">
                                <div className="level-left">
                                  <div className="level-item">
                                    <div>
                                      <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="has-text-link"
                                      >
                                        <strong>{link.title}</strong>
                                      </a>
                                      {link.description && (
                                        <p className="is-size-7 has-text-grey">
                                          {link.description}
                                        </p>
                                      )}
                                      <p className="is-size-7 has-text-grey-light">
                                        {link.url}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="level-right">
                                  <div className="level-item">
                                    <button
                                      className="button is-small is-danger is-light"
                                      onClick={() => handleDeleteLink(link.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Bundle Modal */}
      <div className={`modal ${showBundleModal ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setShowBundleModal(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Create New Bundle</p>
            <button
              className="delete"
              onClick={() => setShowBundleModal(false)}
            ></button>
          </header>
          <section className="modal-card-body">
            {error && (
              <div className="notification is-danger is-light">{error}</div>
            )}
            <form onSubmit={handleCreateBundle}>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="My awesome links"
                    value={bundleName}
                    onChange={(e) => setBundleName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    placeholder="A collection of useful resources"
                    value={bundleDescription}
                    onChange={(e) => setBundleDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </form>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-primary"
              onClick={handleCreateBundle}
            >
              Create
            </button>
            <button
              className="button"
              onClick={() => setShowBundleModal(false)}
            >
              Cancel
            </button>
          </footer>
        </div>
      </div>

      {/* Create Link Modal */}
      <div className={`modal ${showLinkModal ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setShowLinkModal(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Add New Link</p>
            <button
              className="delete"
              onClick={() => setShowLinkModal(false)}
            ></button>
          </header>
          <section className="modal-card-body">
            {error && (
              <div className="notification is-danger is-light">{error}</div>
            )}
            <form onSubmit={handleCreateLink}>
              <div className="field">
                <label className="label">Title</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Awesome Resource"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">URL</label>
                <div className="control">
                  <input
                    className="input"
                    type="url"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    placeholder="Why this link is useful"
                    value={linkDescription}
                    onChange={(e) => setLinkDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </form>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-primary"
              onClick={handleCreateLink}
            >
              Add Link
            </button>
            <button
              className="button"
              onClick={() => setShowLinkModal(false)}
            >
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}
