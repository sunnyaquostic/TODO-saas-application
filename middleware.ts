import { authMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse  } from "next/server";

const publicRoutes = [
  "/",
  "/api/webhooks/register", 
  "/sign-up",
  "/sign-in"
]

export default authMiddleware({
  publicRoutes,
  
  async afterAuth(auth, req) {
    // handle unauth users trying to access protected route
    if(!auth.userId && !publicRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    if(auth.userId) {
      try {
        const user = await clerkClient.users.getUser(auth.userId)
        const role = user.publicMetadata.role as string | undefined
  
        // admin role redirection 
        if (role === "admin" && req.nextUrl.pathname) {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        } 
  
        // prevent non admin user to access admin resource
        if (role !== "admin" && req.nextUrl.pathname.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        } 
  
        // redirect  auth user trying to access public routes
        if (publicRoutes.includes(req.nextUrl.pathname)) {
          return NextResponse.redirect(
            new URL(
              role === "admin" ? "/admin/dashboard" : "/dashboard",
              req.url
            )
          )
        }
      
      } catch (error) {
        console.error(error)
        return NextResponse.redirect(new URL("/error", req.url))
      }
    }

  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};