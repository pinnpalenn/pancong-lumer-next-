import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySession } from "@/lib/session"

const protectedRoutes = ["/dashboard", "/orders", "/products", "/customers", "/settings"]
const publicRoutes = ["/login", "/"]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = req.cookies.get("session")?.value
  const session = await verifySession(cookie)

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (isPublicRoute && session && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
