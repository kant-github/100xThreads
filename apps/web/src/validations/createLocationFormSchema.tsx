
import { z } from "zod";


export const LocationModeEnum = z.enum([
    "OFFLINE",
    "ONLINE"
]);

export const createLocationFormSchema = z.object({
    mode: LocationModeEnum,
    organization_id: z.string().uuid("Invalid organization ID"),
    name: z.string().min(1, "Location name is required"),
    address: z.string().optional(),
    city: z.string().optional(),
});

export type CreateLocationFormSchema = z.infer<typeof createLocationFormSchema>