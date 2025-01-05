import { presetColors } from "@/components/form/FirstComponent";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { useRecoilValue } from "recoil";
import { z } from "zod";

// const session = useRecoilValue(userSessionAtom);

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
        return !!data.password && data.password.length >= 8;
    },
    {
        message: "Password is required and must be at least 8 characters long",
        path: ["password"],
    }
);