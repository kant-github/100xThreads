import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import React from "react"


interface ToolTipComponentProps {
    children: React.ReactNode;
    content: React.ReactNode;
}

export default function ToolTipComponent({ children, content }: ToolTipComponentProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>{children}</TooltipTrigger>
                <TooltipContent>
                    <span>{content}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}