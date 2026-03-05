import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
];

interface Stats {
    students: number;
    books: number;
    authors: number;
    active_borrows: number;
    overdue_borrows: number;
}

interface BorrowRecordItem {
    id: number;
    status: string;
    due_date: string;
    student: { name: string };
    items: Array<{ book: { title: string } }>;
}

export default function Dashboard() {
    const { props } = usePage<{
        stats: Stats;
        recentBorrows: BorrowRecordItem[];
        flash?: { success?: string; error?: string };
    }>();
    const { stats, recentBorrows = [] } = props;
    const flash = (props as { flash?: { success?: string; error?: string } }).flash;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Library Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {flash?.success && (
                    <div className="rounded-lg bg-green-100 p-4 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {flash.error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Link
                        href="/students"
                        className="block rounded-2xl border border-stone-200/60 bg-white/90 p-6 shadow-sm transition hover:border-amber-200 hover:shadow-md dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-amber-900/50"
                    >
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {stats.students}
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-400">Students</div>
                    </Link>
                    <Link
                        href="/books"
                        className="block rounded-2xl border border-stone-200/60 bg-white/90 p-6 shadow-sm transition hover:border-amber-200 hover:shadow-md dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-amber-900/50"
                    >
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {stats.books}
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-400">Books</div>
                    </Link>
                    <Link
                        href="/authors"
                        className="block rounded-2xl border border-stone-200/60 bg-white/90 p-6 shadow-sm transition hover:border-amber-200 hover:shadow-md dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-amber-900/50"
                    >
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {stats.authors}
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-400">Authors</div>
                    </Link>
                    <Link
                        href="/borrow-records"
                        className="block rounded-2xl border border-stone-200/60 bg-white/90 p-6 shadow-sm transition hover:border-amber-200 hover:shadow-md dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-amber-900/50"
                    >
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {stats.active_borrows}
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-400">Active Borrows</div>
                    </Link>
                    <div className="block rounded-2xl border border-stone-200/60 bg-white/90 p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/50">
                        <div
                            className={`text-2xl font-bold ${
                                stats.overdue_borrows > 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-stone-600 dark:text-stone-400'
                            }`}
                        >
                            {stats.overdue_borrows}
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-400">Overdue</div>
                    </div>
                </div>

                <div className="rounded-2xl border border-stone-200/60 bg-white/90 shadow-sm dark:border-stone-800 dark:bg-stone-900/50">
                    <div className="border-b border-stone-200/60 p-6 dark:border-stone-800">
                        <h3 className="text-lg font-medium">Recent Borrow Records</h3>
                    </div>
                    <div className="p-6">
                        {!recentBorrows?.length ? (
                            <p className="text-muted-foreground">No borrow records yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                Student
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                Books
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                Due Date
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                Status
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {recentBorrows.map((record) => (
                                            <tr key={record.id}>
                                                <td className="px-4 py-2 text-sm">
                                                    {record.student.name}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-muted-foreground">
                                                    {record.items
                                                        .map((i) => i.book.title)
                                                        .join(', ')}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-muted-foreground">
                                                    {new Date(
                                                        record.due_date
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs ${
                                                            record.status === 'returned'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                                                                : record.status === 'partial'
                                                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400'
                                                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                                                        }`}
                                                    >
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Link
                                                        href={`/borrow-records/${record.id}`}
                                                        className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
