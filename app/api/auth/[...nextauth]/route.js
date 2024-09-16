import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } // This is the default export for a Next.js API route