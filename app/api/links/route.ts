import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { createClient } from '@/app/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url, title, description, bundleId } = body

    if (!url || !title || !bundleId) {
      return NextResponse.json(
        { error: 'URL, title, and bundleId are required' },
        { status: 400 }
      )
    }

    // Verify bundle belongs to user
    const bundle = await prisma.bundle.findFirst({
      where: {
        id: bundleId,
        userId: user.id,
      },
    })

    if (!bundle) {
      return NextResponse.json({ error: 'Bundle not found' }, { status: 404 })
    }

    const link = await prisma.link.create({
      data: {
        url,
        title,
        description,
        bundleId,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
