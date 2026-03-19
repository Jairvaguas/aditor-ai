'use client';
import { useState, useEffect, useRef } from 'react';

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

function StatCounter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const count = useCountUp(target, 2000, inView);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-slate-400 text-sm">{label}</div>
        </div>
    );
}

export default function AnimatedStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <StatCounter target={50} suffix="+" label="cuentas auditadas" />
            <StatCounter target={200} suffix="+" label="hallazgos detectados" />
            <div className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-[#00D4AA] mb-1">4.9/5</div>
                <div className="text-slate-400 text-sm">satisfacción de usuarios</div>
            </div>
        </div>
    );
}
