"use client";
import React from "react";
import { OrganizationUsersType } from "types/types";
import { AnimatedTooltip } from "../ui/animated-tooltip";

interface AnimatedTooltipPreviewProps {
  className?: string;
  users: OrganizationUsersType[];
}

export function AnimatedTooltipPreview({ className, users }: AnimatedTooltipPreviewProps) {
  return (
    <div className={`flex flex-row items-start w-full ${className}`}>
      <AnimatedTooltip users={users} />
    </div>
  );
}