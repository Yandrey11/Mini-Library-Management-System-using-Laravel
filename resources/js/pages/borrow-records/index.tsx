import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {
    create as createRoute,
    destroy,
    edit as editRoute,
    index as indexRoute,
    show as showRoute,
} from '@/routes/borrow-records';
import type { BreadcrumbItem } from '@/types';

interface Student {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
}

interface BorrowRecordItem {
    book: Book;
    quantity: number;
    returned_quantity: number;
}

interface BorrowRecord {
    id: number;
    status: string;
    due_date: string;
    total_fine: number | string;
    student: Student;
    items: BorrowRecordItem[];
}

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedBorrowRecords {
    data: BorrowRecord[];
    current_page: number;
    last_page: number;
    links: PaginatorLink[];
}

function handleDelete(record: BorrowRecord) {
    if (
        confirm(
            `Are you sure you want to delete this borrow record for ${record.student.name}?`
        )
    ) {
        router.delete(destroy.url(record.id));
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Borrow Records', href: indexRoute.url() },
];

export default function BorrowRecordsIndex({
    borrowRecords,
}: {
    borrowRecords: PaginatedBorrowRecords;
}) {
    const flash = (usePage().props as { flash?: { success?: string; error?: string } })
        .flash;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrow Records" />
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

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Borrow Records
                        </h1>
                        <p className="text-muted-foreground">
                            Manage book borrows and returns
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={createRoute.url()}>
                            New Borrow Record
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Borrow Records</CardTitle>
                        <CardDescription>
                            List of borrow transactions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!borrowRecords.data?.length ? (
                            <p className="text-muted-foreground">
                                No borrow records yet.
                            </p>
                        ) : (
                            <>
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
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {borrowRecords.data.map(
                                                (record) => (
                                                    <tr key={record.id}>
                                                        <td className="px-4 py-2 text-sm">
                                                            {
                                                                record.student
                                                                    .name
                                                            }
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-muted-foreground">
                                                            {record.items
                                                                .map(
                                                                    (i) =>
                                                                        `${i.book.title} (${i.quantity})`
                                                                )
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
                                                                    record.status ===
                                                                    'returned'
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                                                                        : record.status ===
                                                                            'partial'
                                                                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400'
                                                                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                                                                }`}
                                                            >
                                                                {record.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={showRoute.url(
                                                                        record.id
                                                                    )}
                                                                    className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                                                >
                                                                    View
                                                                </Link>
                                                                {record.status !==
                                                                    'returned' && (
                                                                    <Link
                                                                        href={editRoute.url(
                                                                            record.id
                                                                        )}
                                                                        className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                                                    >
                                                                        Return
                                                                    </Link>
                                                                )}
                                                                {record.status ===
                                                                    'returned' && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                record
                                                                            )
                                                                        }
                                                                        className="text-sm text-red-600 hover:underline dark:text-red-400"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {borrowRecords.last_page > 1 && (
                                    <div className="mt-4 flex gap-2">
                                        {borrowRecords.links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.url ?? '#'}
                                                className={`rounded px-3 py-1 text-sm ${
                                                    link.active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted'
                                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
