import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateTaskFormType } from "./CreateTaskForm";
import InputBox from "@/components/utility/InputBox";
import { presetColors } from "../organizationForm/CreateOrganizationFormOne";

interface CreateTaskFormOneProps {
    control: Control<CreateTaskFormType>;
    errors: FieldErrors<CreateTaskFormType>;
}

export default function ({ control, errors }: CreateTaskFormOneProps) {
    return (
        <>
            <Controller
                control={control}
                name='title'
                render={({ field }) => (
                    <InputBox className="" onChange={field.onChange} label="Title" value={field.value} error={errors.title?.message} placeholder="Enter Task title" />
                )}
            />
            <Controller
                control={control}
                name='description'
                render={({ field }) => (
                    <InputBox className="" onChange={field.onChange} label="Description" value={field.value} error={errors.title?.message} placeholder="Enter Task Description" />
                )}
            />
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Choose Organization Color
                </label>
                <Controller
                    name="color"
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
                            {errors.color && (
                                <p className="text-red-500 text-sm">
                                    {errors.color.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            </div>
        </>
    )
}