import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { index as indexRoute, store } from '@/routes/books';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface Author {
    id: number;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Books', href: indexRoute.url() },
    { title: 'Create', href: store.url() },
];

export default function BooksCreate({
    authors = [],
}: {
    authors?: Author[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        isbn: '',
        total_inventory: 0,
        author_ids: [] as number[],
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Book" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Add Book
                    </h1>
                    <p className="text-muted-foreground">
                        Add a new book to the library
                    </p>
                </div>

                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Book Information</CardTitle>
                        <CardDescription>
                            Enter the book details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                post(store.url());
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
                                    min={0}
                                    value={
                                        data.total_inventory ||
                                        (data.total_inventory === 0
                                            ? '0'
                                            : '')
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'total_inventory',
                                            parseInt(e.target.value, 10) || 0
                                        )
                                    }
                                    required
                                />
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
                                    Create Book
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={indexRoute.url()}>
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
