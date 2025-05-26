import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      token: string;
      id?: string | null;
    } & DefaultSession["user"];
  }
}
