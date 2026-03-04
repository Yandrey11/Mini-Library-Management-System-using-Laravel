import { Head, Link, router, usePage } from '@inertiajs/react';
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
    create as createRoute,
    destroy,
    edit as editRoute,
    index as indexRoute,
    show as showRoute,
} from '@/routes/authors';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface Author {
    id: number;
    name: string;
    books_count: number;
}

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedAuthors {
    data: Author[];
    current_page: number;
    last_page: number;
    links: PaginatorLink[];
}

function handleDelete(author: Author) {
    if (confirm(`Are you sure you want to delete ${author.name}?`)) {
        router.delete(destroy.url(author));
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Authors', href: indexRoute.url() },
];

export default function AuthorsIndex({
    authors,
}: {
    authors: PaginatedAuthors;
}) {
    const flash = (usePage().props as { flash?: { success?: string; error?: string } })
        .flash;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Authors" />
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
                            Authors
                        </h1>
                        <p className="text-muted-foreground">
                            Manage book authors
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={createRoute.url()}>Add Author</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Authors</CardTitle>
                        <CardDescription>
                            List of registered authors
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!authors.data?.length ? (
                            <p className="text-muted-foreground">
                                No authors yet.
                            </p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-border">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Name
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Books
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {authors.data.map((author) => (
                                                <tr key={author.id}>
                                                    <td className="px-4 py-2 text-sm">
                                                        {author.name}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-muted-foreground">
                                                        {author.books_count}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={showRoute.url(
                                                                    author
                                                                )}
                                                                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                                            >
                                                                View
                                                            </Link>
                                                            <Link
                                                                href={editRoute.url(
                                                                    author
                                                                )}
                                                                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        author
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
                                {authors.last_page > 1 && (
                                    <div className="mt-4 flex gap-2">
                                        {authors.links.map((link, i) => (
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
