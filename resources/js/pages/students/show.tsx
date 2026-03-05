import { Head, Link, usePage } from '@inertiajs/react';
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
import { edit as editRoute, index as indexRoute } from '@/routes/students';
import type { BreadcrumbItem } from '@/types';

interface BorrowRecord {
    id: number;
    status: string;
    due_date: string;
    items: Array<{ book: { title: string } }>;
}

interface Student {
    id: number;
    student_id: string;
    name: string;
    email: string;
    phone: string | null;
    borrow_records?: BorrowRecord[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Students', href: indexRoute.url() },
];

export default function StudentsShow({ student }: { student: Student }) {
    const flash = (usePage().props as { flash?: { success?: string; error?: string } })
        .flash;

    const breadcrumbsWithStudent: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: student.name, href: editRoute.url(student) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbsWithStudent}>
            <Head title={student.name} />
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
                            {student.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Student details and borrow history
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={editRoute.url(student)}>Edit</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Information</CardTitle>
                        <CardDescription>
                            Contact and identification details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Student ID:
                            </span>{' '}
                            {student.student_id}
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Email:
                            </span>{' '}
                            {student.email}
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Phone:
                            </span>{' '}
                            {student.phone ?? '-'}
                        </div>
                    </CardContent>
                </Card>

                {student.borrow_records?.length ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Borrow History</CardTitle>
                            <CardDescription>
                                Books borrowed by this student
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead>
                                        <tr>
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
                                        {student.borrow_records.map(
                                            (record) => (
                                                <tr key={record.id}>
                                                    <td className="px-4 py-2 text-sm">
                                                        {record.items
                                                            .map(
                                                                (i) =>
                                                                    i.book
                                                                        .title
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
                                                        <Link
                                                            href={`/borrow-records/${record.id}`}
                                                            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                ) : null}
            </div>
        </AppLayout>
    );
}
