import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export default function middleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Unauthorized 1"
            });
        }

        const token = authHeader.split(" ")[1];
        
        // @ts-ignore
        jwt.verify(token, "default_secret", (err, user) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized 2",
                    error: err
                });
            }
            req.user = user as AuthUser;
            next();
        });
    } catch (err) {
        return res.json({
            message: "Some error in middleware function"
        });
    }
}