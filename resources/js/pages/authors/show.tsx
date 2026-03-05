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
import { edit as editRoute, index as indexRoute } from '@/routes/authors';
import type { BreadcrumbItem } from '@/types';

interface Book {
    id: number;
    title: string;
    isbn: string | null;
}

interface Author {
    id: number;
    name: string;
    books?: Book[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Authors', href: indexRoute.url() },
];

export default function AuthorsShow({ author }: { author: Author }) {
    const flash = (usePage().props as { flash?: { success?: string; error?: string } })
        .flash;

    const breadcrumbsWithAuthor: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: author.name, href: editRoute.url(author) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbsWithAuthor}>
            <Head title={author.name} />
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
                            {author.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Author details and books
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={editRoute.url(author)}>Edit</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Author Information</CardTitle>
                        <CardDescription>
                            Books by this author
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!author.books?.length ? (
                            <p className="text-muted-foreground">
                                No books by this author.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {author.books.map((book) => (
                                    <li key={book.id}>
                                        <Link
                                            href={`/books/${book.id}`}
                                            className="text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            {book.title}
                                        </Link>
                                        {book.isbn && (
                                            <span className="ml-2 text-sm text-muted-foreground">
                                                (ISBN: {book.isbn})
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
