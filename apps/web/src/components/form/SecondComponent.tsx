import { Control, FieldErrors } from "react-hook-form";
import { FormValues } from "../dashboard/CreateRoomForm";

interface OrganizationDetailsSectionProps {
    control: Control<FormValues>;
    errors: FieldErrors<FormValues>;
}

export default function ({
    control,
    errors
}: OrganizationDetailsSectionProps) {
    return (
        <div>
            second component
        </div>
    )
}