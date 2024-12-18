import { z } from "zod";

export const createRoomSchema = z.object({
    name: z
        .string()
        .min(4, { message: "Room name should contain at least 4 characters" })
        .max(191, { message: "Room name should not exceed 191 characters" }),
    icon: z
        .string()
        .nullable()
        .optional(),
    type: z
        .string()
        .min(1, { message: "Organization type is required" }),
    termsAndCond: z
        .boolean()
        .refine(val => val === true, { message: "You must accept the terms and conditions" }),
    selectedGroups: z
        .array(z.string())  // Expect an array of strings (group names)
        .min(1, { message: "At least one group must be selected" }),  // Ensure at least one group is selected
});

export type CreateRoomSchemaType = z.infer<typeof createRoomSchema>;
