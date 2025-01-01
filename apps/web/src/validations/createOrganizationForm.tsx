import { presetColors } from "@/components/form/FirstComponent";
import { z } from "zod";

export const formSchema = z.object({
    ownerName: z.string().min(1, "Can't be empty"),
    organizationName: z.string().min(1, "Can't be empty"),
    image: z
        .custom<FileList>()
        .optional()
        .refine(
            (files) => !files || files?.[0]?.type.startsWith("image/"),
            "Only image files are allowed"
        ),
    organizationColor: z.string().optional().refine(
        (color) => !color || presetColors.some((preset) => preset.value === color),
        "Invalid color selection"
    ),
    presetChannels: z.array(z.string()).min(1, 'Select at least one channel'),
    isPrivate: z.boolean().default(false),
    hasPassword: z.boolean().default(false),
    password: z.string().optional().refine(
        (pass, ctx) => {
            if (!ctx.parent.hasPassword) return true;
            if (!pass) return false;
            return pass.length >= 8;
        },
        "Password is required and must be at least 8 characters long"
    ),
});