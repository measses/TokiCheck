import { NextRequest, NextResponse } from 'next/server';

// Google Tag Manager measurement endpoint proxy
// This endpoint forwards GTM requests through Cloudflare's custom path
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gtmId = searchParams.get('id') || process.env.NEXT_PUBLIC_GTM_ID;

  if (!gtmId) {
    return NextResponse.json({ error: 'GTM ID not provided' }, { status: 400 });
  }

  try {
    // Forward to actual GTM endpoint
    const gtmUrl = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
    const response = await fetch(gtmUrl);
    const script = await response.text();

    return new NextResponse(script, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error proxying GTM request:', error);
    return NextResponse.json({ error: 'Failed to load GTM' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward analytics events to GTM
    const gtmUrl = 'https://www.google-analytics.com/g/collect';

    const response = await fetch(gtmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error('Error forwarding analytics event:', error);
    return NextResponse.json({ error: 'Failed to forward event' }, { status: 500 });
  }
}
