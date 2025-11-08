import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getLinkBundlesForUser } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hash the user ID for privacy
    const userId = crypto.createHash('sha256').update(user.id).digest('hex');
    const provider = user.app_metadata.provider || 'email';

    const linkBundles = getLinkBundlesForUser(userId, provider);

    return NextResponse.json(linkBundles);
  } catch (error) {
    console.error('Error getting link bundles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
