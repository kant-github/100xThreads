// import prisma from "@repo/db/client";
// import { NextFunction, Request, Response } from "express";

// export default async function validUserForOrganization(req: Request, res: Response, next: NextFunction) {
//     const user = req.user;
//     const { id: organizationId } = req.params;

//     if (!user?.id) {
//         return res.status(401).json({ message: "Unauthorized: User not authenticated." });
//     }

//     if (!organizationId) {
//         return res.status(400).json({ message: "Bad Request: Organization ID is required." });
//     }

//     try {
//         const organization = await prisma.organization.findUnique({
//             where: { id: organizationId }
//         });

//         if (organization?.hasPassword) {
//             const isValidUser = await prisma.organizationUsers.findFirst({
//                 where: {
//                     organization_id: organizationId,
//                     user_id: user.id,
//                 },
//             });

//             if (!isValidUser) {
//                 return res.status(403).json({ message: "Forbidden: Access denied to the organization." });
//             }
//         }

//         // If we reach here, the user is authorized
//         return next();
//     } catch (error) {
//         return res.status(500).json({ message: "Internal Server Error: Unable to process the request." });
//     }
// }