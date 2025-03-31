export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard", "/org/:path*", "/globalchat/:path*"] };
