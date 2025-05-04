import { Account, AuthOptions, ISODateString } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

export interface UserType {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string | null;
    token?: string | null;
    username?: string | null
}

export interface CustomSession {
    user?: UserType;
    expires: ISODateString;
}

export const authOption: AuthOptions = {
    pages: {
        signIn: "/",
    },
    callbacks: {
        async signIn({ user, account }: { user: UserType; account: Account | null }) {
            try {
                if (account?.provider === "google") {

                    const existingUser = await prisma.users.findFirst({
                        where: {
                            email: user.email!,
                        },
                    });
                    let myUser;
                    if (existingUser) {
                        myUser = await prisma.users.update({
                            where: { email: user.email! },
                            data: {
                                name: user.name!,
                                image: user.image,
                                provider: account.provider,
                                oauth_id: account.providerAccountId!,
                            },
                        });
                    } else {
                        myUser = await prisma.users.create({
                            data: {
                                email: user.email!,
                                name: user.name!,
                                image: user.image,
                                provider: account.provider,
                                oauth_id: account.providerAccountId!,
                            },
                        });
                    }

                    const jwtPayload = {
                        name: myUser.name,
                        email: myUser.email,
                        id: myUser.id,
                    };

                    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || "default_secret", {
                        expiresIn: "365d",
                    });
                    user.id = myUser?.id?.toString();
                    user.token = token;
                    return true;
                }

                return false;
            } catch (err) {
                console.error(err);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user as UserType;
            }
            return token;
        },
        async session({ session, token }: {
            session: CustomSession; token: JWT;
        }) {
            session.user = token.user as UserType;
            return session;
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
};
