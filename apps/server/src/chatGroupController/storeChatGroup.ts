import { Response, Request } from "express";
import prisma from "@repo/db/client"

export default async function(req: Request, res: Response) {
 try{
    const body = req.body;
    const user = req.user

    const chatGroup = await prisma.chatGroup.create({
        data: {
            title: body.title,
            passcode: body.passcode,
            user_id: Number(user?.id)
        }
    }) 

    return res.status(200).json({
        message: "Chat group created successfully"
    })

 } catch(err) {
    console.log("Error in created a chat group")
    res.json({
        message: "Error in created a chat group"
    })
 }
}