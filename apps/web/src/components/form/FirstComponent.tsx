import { useEffect } from 'react';
import { Control, Controller, FieldErrors, useWatch } from 'react-hook-form';
import { FormValues } from '../dashboard/CreateOrganizationForm';
import { FileUpload } from '../ui/file-upload';
import InputBox from '../utility/InputBox';
import { progressBarAtom } from '@/recoil/atoms/progressBarAtom';
import { useRecoilState } from 'recoil';

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

export default function OrganizationDetailsSection({
    control,
    errors,
}: OrganizationDetailsSectionProps) {
    const [currentLevel, setCurrentLevel] = useRecoilState(progressBarAtom);

    const image = useWatch({ control, name: 'image' });
    const ownerName = useWatch({ control, name: 'ownerName' });
    const organizationName = useWatch({ control, name: 'organizationName' });
    const organizationColor = useWatch({ control, name: 'organizationColor' });

    useEffect(() => {
        // Check if all required fields are filled and valid
        const isImageValid = !errors.image;  // Changed this since image is optional
        const allFieldsFilled = ownerName && organizationName && organizationColor;
        const noErrors =
            isImageValid &&
            !errors.ownerName &&
            !errors.organizationName &&
            !errors.organizationColor;

        if (allFieldsFilled && noErrors && currentLevel === 1) {
            setCurrentLevel(2);
        }
    }, [image, ownerName, organizationName, organizationColor, errors, setCurrentLevel, currentLevel]);

    return (
        <div className="space-y-6">
            <div className="flex flex-row items-start justify-center gap-x-6">
                <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <FileUpload
                            value={value}
                            onChange={onChange}
                            error={errors.image?.message}
                        />
                    )}
                />
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

            <div className="flex flex-row items-center justify-start gap-x-2">
                <span className="px-3 py-2 border-zinc-600 bg-white dark:bg-zinc-900/80 text-xs text-zinc-400">
                    /orgs/
                </span>
                <Controller
                    name="organizationName"
                    control={control}
                    render={({ field }) => (
                        <InputBox
                            label="Organization's Name"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.organizationName?.message}
                        />
                    )}
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Choose Organization Color
                </label>
                <Controller
                    name="organizationColor"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-4">
                                {presetColors.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => onChange(color.value)}
                                        className={`w-8 h-8 rounded-[4px] transition-all duration-200 ${value === color.value
                                                ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-black dark:ring-white scale-110'
                                                : 'hover:scale-110'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                            {value && (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded border border-gray-200 dark:border-gray-700"
                                        style={{ backgroundColor: value }}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {value.toUpperCase()}
                                    </span>
                                </div>
                            )}
                            {errors.organizationColor && (
                                <p className="text-red-500 text-sm">
                                    {errors.organizationColor.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            </div>
        </div>
    );
}