import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL to prevent SSRF attacks
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return NextResponse.json(
          { error: 'Invalid URL protocol' },
          { status: 400 }
        );
      }
      // Prevent requests to private/internal networks
      const hostname = parsedUrl.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.16.') ||
        hostname === '::1'
      ) {
        return NextResponse.json(
          { error: 'Access to internal URLs is not allowed' },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the URL and extract OpenGraph metadata
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheURLList/1.0)',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch URL' },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Simple OpenGraph parser
    const getMetaContent = (property: string): string => {
      const regex = new RegExp(
        `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
        'i'
      );
      const match = html.match(regex);
      return match ? match[1] : '';
    };

    const getMetaName = (name: string): string => {
      const regex = new RegExp(
        `<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`,
        'i'
      );
      const match = html.match(regex);
      return match ? match[1] : '';
    };

    const getTitleTag = (): string => {
      const regex = /<title[^>]*>([^<]*)<\/title>/i;
      const match = html.match(regex);
      return match ? match[1] : '';
    };

    const title = getMetaContent('og:title') || getTitleTag();
    const description =
      getMetaContent('og:description') || getMetaName('description');
    const image = getMetaContent('og:image');

    return NextResponse.json({
      url: parsedUrl.toString(),
      title,
      description,
      image,
    });
  } catch (error) {
    console.error('Error fetching OpenGraph data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}
