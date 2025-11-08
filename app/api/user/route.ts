import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getLinkBundlesByUserId } from '@/lib/queries';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id || session.user.email!;
    const bundles = getLinkBundlesByUserId(userId);

    return NextResponse.json({ bundles });
  } catch (error) {
    console.error('Error fetching user bundles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
