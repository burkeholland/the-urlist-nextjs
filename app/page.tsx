'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <section className="section">
        <div className="container has-text-centered">
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title is-1">
            Welcome to The URList
          </h1>
          <p className="subtitle is-3">
            Organize and share your favorite links
          </p>
          <div className="buttons is-centered mt-6">
            <a href="/auth/login" className="button is-light is-large">
              Sign In
            </a>
            <a href="/auth/signup" className="button is-link is-large">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
