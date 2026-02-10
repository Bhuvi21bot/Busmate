import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/profile", "/booking", "/driver-dashboard", "/tracking"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  if (isProtectedRoute) {
    // Get the bearer token from the Authorization header or cookie
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    // If no token, redirect to login with the original URL as redirect parameter
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(loginUrl)
    }

    // Verify token with the auth server
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        // Invalid token, redirect to login
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", path)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      // Error verifying token, redirect to login
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}