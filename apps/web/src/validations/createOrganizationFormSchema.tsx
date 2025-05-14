import { presetColors } from "@/components/form/organizationForm/CreateOrganizationFormOne";
import { z } from "zod";


const passwordValidation = z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const formSchema = z.object({
    ownerName: z.string().min(1, "Can't be empty").default("John Doe"),
    ownerEmail: z.string().min(1, "Can't be empty").default("John@example.com"),
    organizationName: z.string().min(1, "Can't be empty"),
    organizationDescription: z.string().min(1, "Please add description"),
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
    hasPassword: z.boolean().default(true),
    password: z.string().optional(),
    organizationTags: z.array(z.string())
        .min(1, "Add at least one tag")
        .max(5, "Maximum 5 tags allowed")
}).refine(
    (data) => {
        if (!data.hasPassword) return true;
        try {
            return passwordValidation.parse(data.password);
        } catch {
            return false;
        }
    },
    {
        message: "Password must meet all requirements",
        path: ["password"],
    }
);