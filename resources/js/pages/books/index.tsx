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
} from '@/routes/books';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface Author {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
    isbn: string | null;
    total_inventory: number;
    available_inventory: number;
    authors: Author[];
}

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedBooks {
    data: Book[];
    current_page: number;
    last_page: number;
    links: PaginatorLink[];
}

function handleDelete(book: Book) {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
        router.delete(destroy.url(book));
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Books', href: indexRoute.url() },
];

export default function BooksIndex({ books }: { books: PaginatedBooks }) {
    const flash = (usePage().props as { flash?: { success?: string; error?: string } })
        .flash;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Books" />
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
                            Books
                        </h1>
                        <p className="text-muted-foreground">
                            Manage library books
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={createRoute.url()}>Add Book</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Books</CardTitle>
                        <CardDescription>
                            List of books in the library
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!books.data?.length ? (
                            <p className="text-muted-foreground">
                                No books yet.
                            </p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-border">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Title
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    ISBN
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Authors
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Available
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {books.data.map((book) => (
                                                <tr key={book.id}>
                                                    <td className="px-4 py-2 text-sm">
                                                        {book.title}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-muted-foreground">
                                                        {book.isbn ?? '-'}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-muted-foreground">
                                                        {book.authors
                                                            ?.map((a) => a.name)
                                                            .join(', ') ?? '-'}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">
                                                        {book.available_inventory}/
                                                        {book.total_inventory}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={showRoute.url(
                                                                    book
                                                                )}
                                                                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                                            >
                                                                View
                                                            </Link>
                                                            <Link
                                                                href={editRoute.url(
                                                                    book
                                                                )}
                                                                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        book
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
                                {books.last_page > 1 && (
                                    <div className="mt-4 flex gap-2">
                                        {books.links.map((link, i) => (
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
