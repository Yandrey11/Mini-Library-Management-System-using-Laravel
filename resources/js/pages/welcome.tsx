import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Library,
    PenLine,
    Users,
    ArrowRight,
    CheckCircle2,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    const features = [
        {
            icon: BookOpen,
            title: 'Book Catalog',
            description: 'Manage your entire collection with ease. Track titles, copies, and availability.',
        },
        {
            icon: PenLine,
            title: 'Authors',
            description: 'Organize authors and link them to their works. Full bibliographic support.',
        },
        {
            icon: Users,
            title: 'Student Management',
            description: 'Register students and track borrowing history effortlessly.',
        },
        {
            icon: Library,
            title: 'Borrow Records',
            description: 'Track borrows, returns, and overdue items with automatic fine calculation.',
        },
    ];

    return (
        <>
            <Head title="Mini Library">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-stone-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
                {/* Header */}
                <header className="fixed top-0 z-50 w-full border-b border-stone-200/60 bg-white/80 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/80">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-white">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <span className="font-semibold text-stone-900 dark:text-stone-100">
                                Mini Library
                            </span>
                        </div>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                                >
                                    Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100 dark:text-stone-100 dark:hover:bg-stone-800"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                                        >
                                            Get started
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <main className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl md:text-6xl dark:text-stone-100">
                                Simple library management
                                <span className="block text-amber-600 dark:text-amber-400">
                                    for schools & small libraries
                                </span>
                            </h1>
                            <p className="mt-6 text-lg text-stone-600 dark:text-stone-400">
                                Track books, authors, students, and borrow records
                                in one place. No complexity—just what you need.
                            </p>
                            {!auth.user && (
                                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <Link
                                        href={register()}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-base font-medium text-white shadow-lg shadow-amber-600/25 transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 sm:w-auto"
                                    >
                                        Start free
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="inline-flex w-full items-center justify-center rounded-xl border border-stone-300 px-4 py-3 text-base font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        <div className="mt-24 sm:mt-32">
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {features.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="group rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm transition hover:border-amber-200 hover:shadow-md dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-amber-900/50"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-4 font-semibold text-stone-900 dark:text-stone-100">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="mt-24 rounded-2xl border border-stone-200/60 bg-white p-8 sm:p-12 dark:border-stone-800 dark:bg-stone-900/50">
                            <h2 className="text-center text-2xl font-semibold text-stone-900 dark:text-stone-100">
                                Everything you need
                            </h2>
                            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    'Overdue tracking with automatic fines',
                                    'Multi-author book support',
                                    'Full borrow history per student',
                                    'Clean, responsive dashboard',
                                    'Dark mode support',
                                    'Quick search & filter',
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                        <span className="text-stone-700 dark:text-stone-300">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        {!auth.user && (
                            <div className="mt-24 text-center">
                                <p className="text-lg text-stone-600 dark:text-stone-400">
                                    Ready to organize your library?
                                </p>
                                <Link
                                    href={register()}
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-base font-medium text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                                >
                                    Create your account
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-stone-200/60 py-8 dark:border-stone-800">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-stone-500 dark:text-stone-100">
                            Mini Library Management System
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
