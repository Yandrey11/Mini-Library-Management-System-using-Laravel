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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {
    index as indexRoute,
    show as showRoute,
    update,
} from '@/routes/authors';
import type { BreadcrumbItem } from '@/types';

interface Author {
    id: number;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Authors', href: indexRoute.url() },
];

export default function AuthorsEdit({ author }: { author: Author }) {
    const breadcrumbsWithEdit: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: author.name, href: showRoute.url(author) },
        { title: 'Edit', href: update.url(author) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: author.name,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbsWithEdit}>
            <Head title={`Edit ${author.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Edit Author
                    </h1>
                    <p className="text-muted-foreground">
                        Update author information
                    </p>
                </div>

                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Author Information</CardTitle>
                        <CardDescription>
                            Update the author name
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                put(update.url(author));
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Update Author
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={showRoute.url(author)}>
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
