import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export default function authmiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;
        console.log("hit middleware");
        if (!authHeader) {
            res.status(401).json({
                message: "Unauthorized request"
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        // @ts-ignore
        jwt.verify(token, "default_secret", (err, user) => {
            if (err) {
                res.status(401).json({
                    message: "Unauthorized 2",
                    error: err
                });
                return;
            }
            req.user = user as AuthUser;
            next();
        });
    } catch (err) {
        res.json({
            message: "Some error in middleware function"
        });
        return;
    }
}