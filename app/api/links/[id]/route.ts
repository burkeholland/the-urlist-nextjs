import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getLinkBundle, updateLinkBundle, deleteLinkBundle } from '@/lib/db';
import { generateId } from '@/lib/utils';
import crypto from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const linkBundle = getLinkBundle(id);

    if (!linkBundle) {
      return NextResponse.json(
        { error: 'Link bundle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(linkBundle);
  } catch (error) {
    console.error('Error getting link bundle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Get existing bundle to verify ownership
    const existing = getLinkBundle(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Link bundle not found' },
        { status: 404 }
      );
    }

    const userId = crypto.createHash('sha256').update(user.id).digest('hex');
    if (existing.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Ensure all links have IDs
    const links = body.links?.map((link: { id?: string; url: string; title: string; description: string; image: string }) => ({
      ...link,
      id: link.id || generateId(),
    }));

    const updated = updateLinkBundle(id, {
      vanityUrl: body.vanityUrl,
      description: body.description,
      links,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update link bundle' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating link bundle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get existing bundle to verify ownership
    const existing = getLinkBundle(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Link bundle not found' },
        { status: 404 }
      );
    }

    const userId = crypto.createHash('sha256').update(user.id).digest('hex');
    if (existing.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deleted = deleteLinkBundle(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete link bundle' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link bundle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
