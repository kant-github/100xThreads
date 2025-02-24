import prisma from "@repo/db/client";
import { Request, Response } from "express";

export async function getTaskForProject(req: Request, res: Response) {
    if (!req.user?.id) {
        res.send("returned");
        return;
    }

    const { projectId } = req.params;
    if (!projectId) {
        res.status(404).json({
            message: "Didn't get project id"
        })
        return;
    }

    try {
        const task = await prisma.tasks.findMany({
            where: { project_id: projectId }
        })
        res.status(200).json({
            message: "Successfully fetched all task for project",
            data: task
        })
    } catch (err) {
        console.log("Error in fetching task for project");
    }
}