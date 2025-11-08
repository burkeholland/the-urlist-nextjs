import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getLinkBundleByVanityUrl,
  updateLinkBundle,
  deleteLinkBundle,
} from '@/lib/queries';
import type { UpdateLinkBundleInput } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vanityUrl: string }> }
) {
  try {
    const { vanityUrl } = await params;
    const bundle = getLinkBundleByVanityUrl(vanityUrl);

    if (!bundle) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(bundle);
  } catch (error) {
    console.error('Error fetching link bundle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ vanityUrl: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vanityUrl } = await params;
    const bundle = getLinkBundleByVanityUrl(vanityUrl);

    if (!bundle) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const userId = session.user.id || session.user.email!;
    
    // Check if user owns this bundle
    if (bundle.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json() as UpdateLinkBundleInput;
    const updatedBundle = updateLinkBundle(bundle.id, body);

    return NextResponse.json(updatedBundle);
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
  { params }: { params: Promise<{ vanityUrl: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vanityUrl } = await params;
    const bundle = getLinkBundleByVanityUrl(vanityUrl);

    if (!bundle) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const userId = session.user.id || session.user.email!;
    
    // Check if user owns this bundle
    if (bundle.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    deleteLinkBundle(bundle.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link bundle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
