import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function createProjectHandler(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "You are not authorized" });
        return;
    }

    const { channelId } = req.params;
    const { title, description, dueDate } = req.body;
    console.log("in the backend is : ", dueDate);

    try {
        const project = await prisma.project.create({
            data: {
                channel_id: channelId!,
                title: title,
                description: description,
                due_date: new Date(dueDate)
            },
            include: {
                tasks: true
            }
        })

        res.status(200).json({
            message: "Successfully stored the project",
            data: project
        })
        return;
    } catch (err) {
        console.log("Error in creating project")
        res.status(405).json({
            message: "Error in storing the project",
        })
        return;
    }
}