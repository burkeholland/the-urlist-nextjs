import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createLinkBundle, vanityUrlExists } from '@/lib/db';
import { LinkBundle } from '@/lib/types';
import { generateVanityUrl, isValidVanityUrl, generateId } from '@/lib/utils';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to create lists' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate payload
    if (!body || !body.links || body.links.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payload - at least one link is required' },
        { status: 400 }
      );
    }

    // Ensure vanity URL
    const vanityUrl = body.vanityUrl || generateVanityUrl();
    
    // Validate vanity URL format
    if (!isValidVanityUrl(vanityUrl)) {
      return NextResponse.json(
        { error: 'Invalid vanity URL format' },
        { status: 400 }
      );
    }

    // Check if vanity URL already exists
    if (vanityUrlExists(vanityUrl)) {
      return NextResponse.json(
        { error: 'Vanity URL already exists' },
        { status: 409 }
      );
    }

    // Hash the user ID for privacy
    const userId = crypto.createHash('sha256').update(user.id).digest('hex');
    const provider = user.app_metadata.provider || 'email';

    // Ensure all links have IDs
    const links = body.links.map((link: { id?: string; url: string; title: string; description: string; image: string }) => ({
      ...link,
      id: link.id || generateId(),
    }));

    const linkBundle: LinkBundle = {
      id: generateId(),
      vanityUrl,
      description: body.description || '',
      userId,
      provider,
      links,
    };

    const created = createLinkBundle(linkBundle);

    return NextResponse.json(created, { 
      status: 201,
      headers: {
        'Location': `/${created.vanityUrl}`,
      },
    });
  } catch (error) {
    console.error('Error creating link bundle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
