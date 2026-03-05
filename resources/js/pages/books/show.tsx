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
import { edit as editRoute, index as indexRoute } from '@/routes/books';
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Books', href: indexRoute.url() },
];

export default function BooksShow({ book }: { book: Book }) {
    const flash = (usePage().props as { flash?: { success?: string; error?: string } })
        .flash;

    const breadcrumbsWithBook: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: book.title, href: editRoute.url(book) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbsWithBook}>
            <Head title={book.title} />
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
                            {book.title}
                        </h1>
                        <p className="text-muted-foreground">
                            Book details
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={editRoute.url(book)}>Edit</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Book Information</CardTitle>
                        <CardDescription>
                            Details and availability
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="text-sm text-muted-foreground">
                                ISBN:
                            </span>{' '}
                            {book.isbn ?? '-'}
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Authors:
                            </span>{' '}
                            {book.authors?.length
                                ? book.authors.map((a) => a.name).join(', ')
                                : '-'}
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Available:
                            </span>{' '}
                            {book.available_inventory} / {book.total_inventory}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
