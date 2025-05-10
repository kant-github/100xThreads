import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/components/dashboard/CreateOrganizationForm';
import InputBox from '@/components/utility/InputBox';

interface OrganizationDetailsSectionProps {
    control: Control<FormValues>;
    errors: FieldErrors<FormValues>;
}


export const presetColors = [
    { name: 'Slate', value: '#64748b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
];

export default function ({
    control,
    errors,
}: OrganizationDetailsSectionProps) {

    return (
        <div className="space-y-6">
            <div className="flex flex-row items-start justify-center gap-x-6">
                <Controller
                    name="ownerName"
                    control={control}
                    render={({ field }) => (
                            <InputBox
                                disable={true}
                                label="Owner's Name"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.ownerName?.message}
                            />
                    )}
                />
            </div>
            <Controller
                name="ownerEmail"
                control={control}
                render={({ field }) => (
                    <InputBox
                        disable={true}
                        label="Owner's E-mail"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.ownerName?.message}
                    />
                )}
            />
        </div>
    );
}