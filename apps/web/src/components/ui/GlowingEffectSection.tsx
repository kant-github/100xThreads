"use client";
import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function () {
    return (
        <ul className="grid grid-cols-1 grid-rows-none gap-3 md:grid-cols-12 md:grid-rows-3 lg:gap-3 xl:max-h-[28rem] xl:grid-rows-2">
            <GridItem
                area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                icon={<Box className="h-3 w-3 text-black dark:text-neutral-400" />}
                title="Do things the right way"
                description="Running out of copy so I'll write anything."
            />
            <GridItem
                area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                icon={<Settings className="h-3 w-3 text-black dark:text-neutral-400" />}
                title="The best AI code editor ever."
                description="Yes, it's true. I'm not even kidding. Ask my mom if you don't believe me."
            />
            <GridItem
                area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                icon={<Lock className="h-3 w-3 text-black dark:text-neutral-400" />}
                title="You should buy Aceternity UI Pro"
                description="It's the best money you'll ever spend"
            />
            <GridItem
                area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                icon={<Sparkles className="h-3 w-3 text-black dark:text-neutral-400" />}
                title="This card is also built by Cursor"
                description="I'm not even kidding. Ask my mom if you don't believe me."
            />
            <GridItem
                area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                icon={<Search className="h-3 w-3 text-black dark:text-neutral-400" />}
                title="Coming soon on Aceternity UI"
                description="I'm writing the code as I record this, no shit."
            />
        </ul>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={`min-h-[10rem] list-none ${area}`}>
            <div className="relative h-full rounded-xl border p-1.5 md:rounded-2xl md:p-2">
                <GlowingEffect
                    spread={30}
                    glow={true}
                    disabled={false}
                    proximity={48}
                    inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-lg border-0.75 p-4 dark:shadow-[0px_0px_20px_0px_#2D2D2D] md:p-4">
                    <div className="relative flex flex-1 flex-col justify-between gap-2">
                        <div className="w-fit rounded-md border border-gray-600 p-1.5">
                            {icon}
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg/[1.25rem] font-semibold font-sans -tracking-4 md:text-xl/[1.5rem] text-balance text-black dark:text-white">
                                {title}
                            </h3>
                            <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-xs/[1rem] md:text-sm/[1.25rem] text-black dark:text-neutral-400">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};