import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'mandalas_admin_session'
const ENABLE_ADMIN = process.env.ENABLE_ADMIN === 'true'
const ENABLE_GUEST_PORTAL = process.env.ENABLE_GUEST_PORTAL === 'true'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isAdminPath = pathname.startsWith('/admin')
    const isAdminApiPath = pathname.startsWith('/api/admin')
    const isAdminSessionPath = pathname === '/api/admin/session'
    const isGuestPortalPath = pathname.startsWith('/my-booking')

    if (isAdminApiPath && !ENABLE_ADMIN) {
        return NextResponse.json({ error: 'Admin disabled' }, { status: 404 })
    }

    if (isAdminPath && !ENABLE_ADMIN) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (isGuestPortalPath && !ENABLE_GUEST_PORTAL) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    const isPublicPath = pathname === '/admin/login'
    const hasSession = request.cookies.has(COOKIE_NAME)

    if (isAdminPath && !isPublicPath && !hasSession) {
        const loginUrl = new URL('/admin/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    if (isAdminApiPath && !isAdminSessionPath && !hasSession) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (isPublicPath && hasSession) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/my-booking/:path*',
    ],
}

export default middleware
