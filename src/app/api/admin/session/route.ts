import { NextResponse } from "next/server"

const COOKIE_NAME = "mandalas_admin_session"

export async function POST() {
    const response = NextResponse.json({ ok: true })

    response.cookies.set(COOKIE_NAME, "true", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
    })

    return response
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true })

    response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    })

    return response
}
