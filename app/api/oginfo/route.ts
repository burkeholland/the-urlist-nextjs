import { NextRequest, NextResponse } from 'next/server';
import type { OpenGraphMetadata } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the URL and extract Open Graph metadata
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheURList/1.0; +http://urlist.com)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch URL' },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Simple regex-based extraction of Open Graph tags
    const metadata: OpenGraphMetadata = {};

    const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    if (titleMatch) metadata.title = titleMatch[1];

    const descMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    if (descMatch) metadata.description = descMatch[1];

    const imageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (imageMatch) metadata.image = imageMatch[1];

    const urlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
    if (urlMatch) metadata.url = urlMatch[1];

    // Fallback to title tag if no og:title
    if (!metadata.title) {
      const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (titleTagMatch) metadata.title = titleTagMatch[1];
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching Open Graph data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}
