import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {
    index as indexRoute,
    show as showRoute,
    update,
} from '@/routes/books';
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

export default function BooksEdit({
    book,
    authors = [],
}: {
    book: Book;
    authors?: Author[];
}) {
    const breadcrumbsWithEdit: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: book.title, href: showRoute.url(book) },
        { title: 'Edit', href: update.url(book) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: book.title,
        isbn: book.isbn ?? '',
        total_inventory: book.total_inventory,
        author_ids: book.authors?.map((a) => a.id) ?? [],
    });

    const toggleAuthor = (id: number) => {
        setData(
            'author_ids',
            data.author_ids.includes(id)
                ? data.author_ids.filter((a) => a !== id)
                : [...data.author_ids, id]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbsWithEdit}>
            <Head title={`Edit ${book.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Edit Book
                    </h1>
                    <p className="text-muted-foreground">
                        Update book information
                    </p>
                </div>

                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Book Information</CardTitle>
                        <CardDescription>
                            Update the book details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                put(update.url(book));
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="isbn">ISBN</Label>
                                <Input
                                    id="isbn"
                                    value={data.isbn}
                                    onChange={(e) =>
                                        setData('isbn', e.target.value)
                                    }
                                />
                                <InputError message={errors.isbn} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="total_inventory">
                                    Total Inventory
                                </Label>
                                <Input
                                    id="total_inventory"
                                    type="number"
                                    min={book.available_inventory}
                                    value={data.total_inventory}
                                    onChange={(e) =>
                                        setData(
                                            'total_inventory',
                                            parseInt(e.target.value, 10) || 0
                                        )
                                    }
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Currently {book.available_inventory}/
                                    {book.total_inventory} available
                                </p>
                                <InputError message={errors.total_inventory} />
                            </div>
                            {authors.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Authors</Label>
                                    <div className="flex flex-wrap gap-4 rounded-md border p-4">
                                        {authors.map((author) => (
                                            <label
                                                key={author.id}
                                                className="flex cursor-pointer items-center gap-2"
                                            >
                                                <Checkbox
                                                    checked={data.author_ids.includes(
                                                        author.id
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleAuthor(author.id)
                                                    }
                                                />
                                                <span className="text-sm">
                                                    {author.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.author_ids} />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Update Book
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={showRoute.url(book)}>
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
