import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    edit as editRoute,
    index as indexRoute,
} from '@/routes/borrow-records';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface Book {
    id: number;
    title: string;
}

interface BorrowRecordItem {
    id: number;
    book: Book;
    quantity: number;
    returned_quantity: number;
}

interface Student {
    id: number;
    name: string;
}

interface BorrowRecord {
    id: number;
    status: string;
    due_date: string;
    total_fine: number | string;
    student: Student;
    items: BorrowRecordItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Borrow Records', href: indexRoute.url() },
];

export default function BorrowRecordsShow({
    borrowRecord,
    calculatedFine = 0,
}: {
    borrowRecord: BorrowRecord;
    calculatedFine?: number;
}) {
    const flash = (usePage().props as {
        flash?: { success?: string; error?: string; info?: string };
    }).flash;

    const breadcrumbsWithRecord: BreadcrumbItem[] = [
        ...breadcrumbs,
        {
            title: `Borrow #${borrowRecord.id}`,
            href: editRoute.url(borrowRecord.id),
        },
    ];

    const fine = Number(borrowRecord.total_fine ?? calculatedFine);

    return (
        <AppLayout breadcrumbs={breadcrumbsWithRecord}>
            <Head title={`Borrow Record #${borrowRecord.id}`} />
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
                {flash?.info && (
                    <div className="rounded-lg bg-blue-100 p-4 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {flash.info}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Borrow Record #{borrowRecord.id}
                        </h1>
                        <p className="text-muted-foreground">
                            {borrowRecord.student.name}
                        </p>
                    </div>
                    {borrowRecord.status !== 'returned' && (
                        <Button asChild>
                            <Link href={editRoute.url(borrowRecord.id)}>
                                Return Books
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Borrow Details</CardTitle>
                        <CardDescription>
                            Books and status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Student:
                            </span>{' '}
                            <Link
                                href={`/students/${borrowRecord.student.id}`}
                                className="text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                {borrowRecord.student.name}
                            </Link>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Due Date:
                            </span>{' '}
                            {new Date(
                                borrowRecord.due_date
                            ).toLocaleDateString()}
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Status:
                            </span>{' '}
                            <span
                                className={`rounded-full px-2 py-1 text-xs ${
                                    borrowRecord.status === 'returned'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                                        : borrowRecord.status === 'partial'
                                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400'
                                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                                }`}
                            >
                                {borrowRecord.status}
                            </span>
                        </div>
                        {fine > 0 && (
                            <div>
                                <span className="text-sm text-muted-foreground">
                                    Total Fine:
                                </span>{' '}
                                ₱{fine.toFixed(2)}
                            </div>
                        )}
                        <div>
                            <span className="text-sm font-medium">
                                Books:
                            </span>
                            <ul className="mt-2 space-y-1">
                                {borrowRecord.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between rounded-md border px-3 py-2"
                                    >
                                        <Link
                                            href={`/books/${item.book.id}`}
                                            className="text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            {item.book.title}
                                        </Link>
                                        <span className="text-sm text-muted-foreground">
                                            {item.returned_quantity ?? 0}/
                                            {item.quantity} returned
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
