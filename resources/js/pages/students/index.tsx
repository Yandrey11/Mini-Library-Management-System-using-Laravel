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
} from '@/routes/students';
import type { BreadcrumbItem } from '@/types';

interface Student {
    id: number;
    student_id: string;
    name: string;
    email: string;
    phone: string | null;
}

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedStudents {
    data: Student[];
    current_page: number;
    last_page: number;
    links: PaginatorLink[];
}

function handleDelete(student: Student) {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
        router.delete(destroy.url(student));
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Students', href: indexRoute.url() },
];

export default function StudentsIndex({
    students,
}: {
    students: PaginatedStudents;
}) {
    const flash = (usePage().props as { flash?: { success?: string; error?: string } })
        .flash;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
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
                            Students
                        </h1>
                        <p className="text-muted-foreground">
                            Manage library students
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={createRoute.url()}>Add Student</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Students</CardTitle>
                        <CardDescription>
                            List of registered students
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!students.data?.length ? (
                            <p className="text-muted-foreground">
                                No students yet.
                            </p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-border">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    ID
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Name
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Email
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Phone
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {students.data.map((student) => (
                                                <tr key={student.id}>
                                                    <td className="px-4 py-2 text-sm">
                                                        {student.student_id}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">
                                                        {student.name}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-muted-foreground">
                                                        {student.email}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-muted-foreground">
                                                        {student.phone ?? '-'}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={showRoute.url(
                                                                    student
                                                                )}
                                                                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                                            >
                                                                View
                                                            </Link>
                                                            <Link
                                                                href={editRoute.url(
                                                                    student
                                                                )}
                                                                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        student
                                                                    )
                                                                }
                                                                className="text-sm text-red-600 hover:underline dark:text-red-400"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {students.last_page > 1 && (
                                    <div className="mt-4 flex gap-2">
                                        {students.links.map((link, i) => (
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
