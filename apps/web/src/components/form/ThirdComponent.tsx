import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormValues } from "../dashboard/CreateRoomForm";
import InputBox from "../utility/InputBox";
import Switch from "../buttons/Switch";

interface OrganizationDetailsSectionProps {
    control: Control<FormValues>;
    errors: FieldErrors<FormValues>;
}

export default function ({
    control,
    errors
}: OrganizationDetailsSectionProps) {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Organization Privacy
                </label>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Private Organization
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Make your organization visible to members only
                            </p>
                        </div>
                        <Controller
                            name="isPrivate"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Switch
                                    checked={value}
                                    onCheckedChange={onChange}
                                />
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Password Protection
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Require a password to join your organization
                            </p>
                        </div>
                        <Controller
                            name="hasPassword"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Switch
                                    checked={value}
                                    onCheckedChange={onChange}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            <Controller
                name="password"
                control={control}
                render={({ field, formState }) => {
                    const showPasswordField = formState.watch?.('hasPassword');
                    if (!showPasswordField) return null;

                    return (
                        <InputBox
                            label="Organization Password"
                            type="password"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.password?.message}
                            placeholder="Enter a strong password"
                        />
                    );
                }}
            />
        </div>
    )
}