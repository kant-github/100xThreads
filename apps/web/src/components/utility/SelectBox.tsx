import React from "react";

interface OrganizationTypeProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function SelectBox({
  selectedType,
  onTypeChange,
}: OrganizationTypeProps) {
  const organizationTypes = [
    "Startup",
    "Non-Profit",
    "Educational",
    "Government",
    "Corporate",
    "Community",
  ];

  return (
    <div className="flex flex-col space-y-2 relative">
      <label
        htmlFor="organizationType"
        className="text-xs font-light tracking-wider text-gray-700 dark:text-gray-200"
      >
        Organization Type
      </label>
      <div className="relative">
        <select
          id="organizationType"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-4 py-[9px] text-xs font-thin border border-gray-300 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[4px] w-full pr-4 placeholder:text-black dark:bg-zinc-800 dark:text-gray-200 dark:placeholder:text-gray-200 appearance-none"
        >
          <option value="" disabled className="text-gray-700 dark:text-gray-200">
            Select Organization Type
          </option>
          {organizationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 text-gray-700 dark:text-gray-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
