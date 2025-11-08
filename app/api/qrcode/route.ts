import { NextRequest, NextResponse } from 'next/server';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Escape the URL to prevent XSS
  const safeUrl = escapeXml(url);

  // Return a simple SVG-based response
  // In a real implementation, you'd use a QR code library
  // For now, we'll return a placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="white"/>
  <text x="100" y="100" text-anchor="middle" fill="black" font-size="12">QR Code for: ${safeUrl}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}
