import { EventStatus } from "types/types";
import { z } from "zod";

export const createEventFormSchema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(191, "Title must be less than 191 characters"),

    start_time: z.date({
        required_error: "Start time is required",
        invalid_type_error: "Please provide a valid start time"
    }),

    created_by: z.number()
        .int("User ID must be an integer")
        .positive("User ID must be positive"),

    event_room_id: z.string()
        .uuid("Event room ID must be a valid UUID"),

    status: z.enum([EventStatus.LIVE, EventStatus.COMPLETED, EventStatus.CANCELED, EventStatus.PENDING]),

    description: z.string().max(300, "Description must be 300 characters or less").optional(),
    end_time: z.date().nullable().optional(),

    location: z.string().uuid("Choose a location"),

    meet_link: z.string().optional(),

    google_event_id: z.string().nullable().optional(),
    linkedTags: z.array(z.string().uuid("Each tag ID must be a valid UUID")).min(1, "At least one tag must be selected")
}).refine((data) => {
    // Validation: end_time should be after start_time if provided
    if (data.end_time && data.start_time) {
        return data.end_time > data.start_time;
    }
    return true;
}, {
    message: "End time must be after start time",
    path: ["end_time"],
});

export type CreateEventFormSchema = z.infer<typeof createEventFormSchema>;