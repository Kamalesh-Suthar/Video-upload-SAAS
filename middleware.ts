import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/home", "/sign-in", "/sign-up"]);

const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url);
  const isAccessingHomePage = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  if (userId && isPublicRoute(req) && !isAccessingHomePage) {
    return NextResponse.redirect(new URL("/home"));
  }
  //not logged in
  if (!userId) {
		// If the user is not logged in and trying to access a protected route, redirect to the sign-in page
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

		// If the request is for a protected API and the user is not logged in, redirect to the sign-in page
		if(isApiRequest && !isPublicApiRoute(req)) {
			return NextResponse.redirect(new URL("/sign-in", req.url));
		}
		return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
