import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createLinkBundle, isVanityUrlAvailable } from '@/lib/queries';
import type { CreateLinkBundleInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as CreateLinkBundleInput;
    
    // Validate required fields
    if (!body.vanity_url || !body.links || body.links.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: vanity_url and at least one link' },
        { status: 400 }
      );
    }

    // Check if vanity URL is available
    if (!isVanityUrlAvailable(body.vanity_url)) {
      return NextResponse.json(
        { error: 'Vanity URL already exists' },
        { status: 409 }
      );
    }

    const userId = session.user.id || session.user.email!;
    const bundle = createLinkBundle(userId, body);

    return NextResponse.json(bundle, { status: 201 });
  } catch (error) {
    console.error('Error creating link bundle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
