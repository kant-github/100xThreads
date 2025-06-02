import prisma from "@repo/db/client";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export default async function loginUserController(req: Request, res: Response) {
    try {
        const { user, account } = req.body;

        // Check if user exists
        const existingUser = await prisma.users.findFirst({
            where: {
                email: user.email!,
            },
        });

        let myUser;

        if (existingUser) {
            // Update existing user
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
            // Create new user
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

        // Create JWT token
        const jwtPayload = {
            name: myUser.name,
            email: myUser.email,
            id: myUser.id,
        };

        const token = jwt.sign(jwtPayload, "default_secret", {
            expiresIn: "365d",
        });

        res.json({
            success: true,
            user: myUser,
            token: token
        });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Authentication failed"
        });
        return;
    }
}