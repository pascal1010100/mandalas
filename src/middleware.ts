import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // 1. Define routes that require authentication
    const isProtectedPath = request.nextUrl.pathname.startsWith('/admin')

    // 2. Define routes that are public (like login)
    const isPublicPath = request.nextUrl.pathname === '/admin/login'

    // 3. Check for session (Temporary Cookie Check for Phase 1)
    const hasSession = request.cookies.has('mandalas_admin_session')

    // LOGIC:
    // If trying to access a protected route (like /admin) AND not logged in
    // -> Redirect to Login
    if (isProtectedPath && !isPublicPath && !hasSession) {
        const loginUrl = new URL('/admin/login', request.url)
        // Optional: Add ?from=/admin/reservations to redirect back after login
        return NextResponse.redirect(loginUrl)
    }

    // If trying to access Login page BUT already logged in
    // -> Redirect to Dashboard (Why login again?)
    if (isPublicPath && hasSession) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        // Match all paths starting with /admin
        '/admin/:path*',
    ],
}

export default middleware
