import { z } from "zod";

export const createEventFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(191, "Title must be less than 191 characters"),
    description: z.string().optional(),
    start_time: z.date({ required_error: "Start time is required" }),
    end_time: z.date().optional(),
    location: z.string().optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED'], {
        errorMap: () => ({ message: "Status must be PENDING, CONFIRMED, or CANCELLED" })
    }).default('PENDING'),
    google_event_id: z.string().optional(),
    meet_link: z.string().url("Please enter a valid URL").optional(),
    created_by: z.number({ required_error: "Creator ID is required" }).int("Creator ID must be an integer"),
});