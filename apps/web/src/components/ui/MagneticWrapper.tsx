import gsap from "gsap";
import { useEffect, useRef } from "react";

interface MagneticWrapperProps {
    children: React.ReactNode;
}

export default function ({ children }: MagneticWrapperProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        const xTo = gsap.quickTo(ref.current, "x", { duration: 1, ease: 'elastic.out(1, 0.3)' });
        const yTo = gsap.quickTo(ref.current, "y", { duration: 1, ease: 'elastic.out(1, 0.3)' });

        function mouseMove(e: MouseEvent) {
            if (!ref.current) return;
            const { clientX, clientY } = e;
            const { width, height, left, top } = ref.current.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            xTo(x);
            yTo(y);
        }

        function mouseLeave() {
            xTo(0);
            yTo(0);
        }


        ref.current?.addEventListener('mousemove', mouseMove);
        ref.current?.addEventListener('mouseleave', mouseLeave);

        return () => {
            ref.current?.removeEventListener('mousemove', mouseMove);
            ref.current?.removeEventListener('mouseleave', mouseMove);
        }
    }, [])

    return (
        <div ref={ref}>
            {children}
        </div>
    )
}