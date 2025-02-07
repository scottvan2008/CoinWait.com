import { NextResponse, NextRequest } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from './app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: ['/((?!api|_next/static|assets|favicon.ico|sw.js|site.webmanifest).*)'],
};

export function middleware(req: NextRequest) {
  // Skip middleware for image and static asset paths
  if (
    req.nextUrl.pathname.startsWith('/_next/image') ||
    req.nextUrl.pathname.endsWith('.png') ||
    req.nextUrl.pathname.endsWith('.jpg') ||
    req.nextUrl.pathname.endsWith('.jpeg') ||
    req.nextUrl.pathname.endsWith('.gif') ||
    req.nextUrl.pathname.endsWith('.webp') ||
    req.nextUrl.pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }

  let lng: string | undefined | null;
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url));
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '');
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}