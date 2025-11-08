import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { createClient } from '@/app/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { url, title, description } = body

    // Verify link belongs to user
    const link = await prisma.link.findFirst({
      where: { id },
      include: {
        bundle: true,
      },
    })

    if (!link || link.bundle.userId !== user.id) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        url,
        title,
        description,
      },
    })

    return NextResponse.json(updatedLink)
  } catch (error) {
    console.error('Error updating link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify link belongs to user
    const link = await prisma.link.findFirst({
      where: { id },
      include: {
        bundle: true,
      },
    })

    if (!link || link.bundle.userId !== user.id) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    await prisma.link.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Link deleted successfully' })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
