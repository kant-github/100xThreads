import { z } from "zod";
import { presetColors } from "@/components/form/FirstComponent";
import crypto from 'crypto-js';

// Password validation schema with stronger requirements
const passwordValidation = z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const formSchema = z.object({
    ownerName: z.string().min(1, "Can't be empty").default("John Doe"),
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



export const hashPassword = (password: string): string => {
    // First, create a salt
    const salt = crypto.lib.WordArray.random(16).toString();
    // Combine password and salt
    const combinedPass = password + salt;
    // Hash the combination
    const hashedPassword = crypto.SHA256(combinedPass).toString();
    // Return both salt and hash, separated by a delimiter
    return `${salt}:${hashedPassword}`;
};



// Let me help you implement the private organization flow. First, let's understand the secure way to handle passwords and then implement both frontend and backend.
// Password Handling Flow:

// When creating organization: Frontend should hash the password before sending it to the server
// Server should add additional salt and rehash before storing
// When joining: Frontend sends password attempt, server verifies against stored hash