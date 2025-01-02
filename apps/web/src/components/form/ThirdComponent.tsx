import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormValues } from "../dashboard/CreateOrganizationForm";
import InputBox from "../utility/InputBox";
import Switch from "../buttons/Switch";

interface ThirdComponentProps {
    control: Control<FormValues>;
    errors: FieldErrors<FormValues>;
    watch: (name: string) => any;
}

export default function ThirdComponent({
    control,
    errors,
    watch
}: ThirdComponentProps) {
    return (
        <div className="mt-8 space-y-8">
            <div className="space-y-6">
                <div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    Private Organization
                                </label>
                                <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
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
                                <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    Password Protection
                                </label>
                                <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
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
                    render={({ field }) => {
                        const showPasswordField = watch('hasPassword');
                        if (!showPasswordField) return <></>;
                        return (
                            <InputBox
                                label="Organization Password"
                                type="password"
                                value={field.value || ''}
                                onChange={field.onChange}
                                error={errors.password?.message || undefined}
                                placeholder="Enter a strong password (minimum 8 characters)"
                            />
                        );
                    }}
                />
                <button type="submit">Submit</button>
            </div>
        </div>
    );
}