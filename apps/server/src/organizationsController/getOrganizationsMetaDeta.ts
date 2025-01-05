import { Request, Response } from "express";

export async function getOrganizationsMetaDeta(req: Request, res: Response) {
    const { id: organizationId } = req.params;
    const userId = req.user?.id

    console.log(organizationId + " " + userId);
}