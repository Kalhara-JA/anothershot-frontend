import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";
import { UserRole } from "@/app/lib/enums";
import cookie from "cookie";

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isPreflight = request.method === "OPTIONS";

  const isAdminRoute = request.nextUrl.pathname.startsWith("/user/admin/");

  console.log(`Origin: ${origin}`);
  console.log(`Is preflight request: ${isPreflight}`);
  console.log(`Is admin route: ${isAdminRoute}`);

  if (isPreflight) {
    const preflightHeaders = {
      "Access-Control-Allow-Origin": origin,
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  if (isAdminRoute) {
    const isAdmin = await checkAdminAuthorization(request);
    console.log(`Is admin: ${isAdmin}`);
    if (!isAdmin) {
      return new NextResponse("", {
        status: 307,
        headers: {
          Location: `${process.env.NEXT_PUBLIC_BASE_URL}/unauthorized`,
        },
      });
    }
  }

  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", origin);
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value as string);
  });

  return response;
}

async function checkAdminAuthorization(request: NextRequest): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    console.log("No cookie header found");
    return false;
  }

  const cookies = cookie.parse(cookieHeader);
  const token = cookies["next-auth.session-token"];

  if (!token) {
    console.log("No token found in cookies");
    return false;
  }

  try {
    const decoded = await decode({
      token: token,
      secret: process.env.NEXTAUTH_SECRET as string,
    });

    console.log(`Decoded token: ${JSON.stringify(decoded)}`);

    if (
      typeof decoded === "object" &&
      decoded &&
      decoded.user?.userRole === UserRole.ADMIN
    ) {
      return true;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }

  return false;
}

export const config = {
  matcher: ["/api/:path*", "/user/admin/:path*"],
};
