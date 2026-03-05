import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

type Props = {
    children: ReactNode;
    variant?: 'header' | 'sidebar';
};

export function AppShell({ children, variant = 'header' }: Props) {
    const isOpen = usePage().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-amber-50/80 via-white to-stone-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
                {children}
            </div>
        );
    }

    return (
        <SidebarProvider
            defaultOpen={isOpen}
            className="bg-gradient-to-b from-amber-50/80 via-white to-stone-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950"
        >
            {children}
        </SidebarProvider>
    );
}
