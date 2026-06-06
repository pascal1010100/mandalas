import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const COOKIE_NAME = "mandalas_admin_session"
const ENABLE_ADMIN = process.env.ENABLE_ADMIN === "true"

function getSupabaseAuthClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase auth environment variables")
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

export async function POST(request: Request) {
    if (!ENABLE_ADMIN) {
        return NextResponse.json({ error: "Admin disabled" }, { status: 404 })
    }

    const authHeader = request.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

    if (!token) {
        return NextResponse.json({ error: "Missing auth token" }, { status: 401 })
    }

    const supabase = getSupabaseAuthClient()
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
        return NextResponse.json({ error: "Invalid auth token" }, { status: 401 })
    }

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
    if (!ENABLE_ADMIN) {
        return NextResponse.json({ ok: true })
    }

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
