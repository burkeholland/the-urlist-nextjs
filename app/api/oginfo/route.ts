import { NextRequest, NextResponse } from 'next/server';
import type { OpenGraphMetadata } from '@/lib/types';

function isValidHttpUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL to prevent SSRF attacks
    if (!isValidHttpUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL. Only HTTP and HTTPS URLs are allowed.' },
        { status: 400 }
      );
    }

    // Additional validation: prevent requests to localhost/private IPs
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Block localhost and private IP ranges
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
      hostname === '::1' ||
      hostname === '[::1]'
    ) {
      return NextResponse.json(
        { error: 'Requests to internal addresses are not allowed' },
        { status: 400 }
      );
    }

    // Fetch the URL and extract Open Graph metadata
    // Note: URL has been validated above to prevent SSRF attacks
    // - Only HTTP/HTTPS protocols allowed
    // - Localhost and private IP addresses blocked
    // - Timeout set to 5 seconds
    // - Content-type validation to ensure HTML response
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheURList/1.0; +http://urlist.com)',
      },
      // Add timeout and size limits
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch URL' },
        { status: 400 }
      );
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      return NextResponse.json(
        { error: 'URL does not point to an HTML page' },
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
