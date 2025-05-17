import { OrganizationTagType } from "types/types";

interface OrganizationTagTickerProps {
    tag: OrganizationTagType
}

export default function OrganizationTagTicker({ tag }: OrganizationTagTickerProps) {
    const bgColor = `${tag.color}33` || "#E0E7FF"; // Slightly translucent background
    const borderColor = tag.color || "#6366F1"; // Indigo-500 fallback
    const textColor = tag.color || "#4338CA"; // Indigo-700 fallback
    return (
        <div className="w-fit rounded-full mr-3 text-[11px] px-2 py-[3px] select-none" style={{
            backgroundColor: bgColor,
            border: borderColor,
            color: textColor
        }} >
            # {tag.name}
        </div>
    )
}