import { auth } from "@/lib/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  // Protect routes that require authentication
  const protectedRoutes = ['/recipes/new', '/recipes/[id]/edit', '/recipes/[id]/delete', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.includes('[')) {
      // Handle dynamic routes
      const routePattern = route.replace(/\[.*?\]/g, '[^/]+')
      const regex = new RegExp(`^${routePattern}$`)
      return regex.test(nextUrl.pathname)
    }
    return nextUrl.pathname.startsWith(route)
  })

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/auth/signin', nextUrl))
  }

  return null
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 