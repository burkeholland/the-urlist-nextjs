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

    // Fetch the URL and extract OpenGraph metadata
    const response = await fetch(url);
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
      url,
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
