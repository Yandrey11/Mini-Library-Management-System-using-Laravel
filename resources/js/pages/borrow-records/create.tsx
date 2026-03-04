import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as indexRoute, store } from '@/routes/borrow-records';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface Student {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
}

interface BorrowItem {
    book_id: number;
    quantity: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Borrow Records', href: indexRoute.url() },
    { title: 'Create', href: store.url() },
];

const today = new Date().toISOString().slice(0, 10);

export default function BorrowRecordsCreate({
    students = [],
    books = [],
}: {
    students?: Student[];
    books?: Book[];
}) {
    const { data, setData, transform, post, processing, errors } = useForm({
        student_id: '' as string | number,
        borrow_date: today,
        due_date: today,
        items: [{ book_id: '' as number | '', quantity: 1 }] as BorrowItem[],
    });

    const addItem = () => {
        setData('items', [
            ...data.items,
            { book_id: '' as number | '', quantity: 1 },
        ]);
    };

    const removeItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index)
        );
    };

    const updateItem = (
        index: number,
        field: 'book_id' | 'quantity',
        value: number | string
    ) => {
        const next = [...data.items];
        next[index] = { ...next[index], [field]: value };
        setData('items', next);
    };

    const validItems = data.items.filter(
        (i) => i.book_id !== '' && i.book_id !== undefined && i.quantity > 0
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validItems.length === 0) return;
        transform((d) => ({
            student_id: Number(d.student_id) || d.student_id,
            borrow_date: d.borrow_date,
            due_date: d.due_date,
            items: validItems.map((i) => ({
                book_id: i.book_id,
                quantity: i.quantity,
            })),
        })).post(store.url());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Borrow Record" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        New Borrow Record
                    </h1>
                    <p className="text-muted-foreground">
                        Record a new book borrow
                    </p>
                </div>

                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Borrow Details</CardTitle>
                        <CardDescription>
                            Select student, dates, and books
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="student_id">Student</Label>
                                <Select
                                    value={String(data.student_id)}
                                    onValueChange={(v) =>
                                        setData('student_id', v ? Number(v) : '')
                                    }
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((s) => (
                                            <SelectItem
                                                key={s.id}
                                                value={String(s.id)}
                                            >
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.student_id} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="borrow_date">
                                        Borrow Date
                                    </Label>
                                    <Input
                                        id="borrow_date"
                                        type="date"
                                        value={data.borrow_date}
                                        onChange={(e) =>
                                            setData(
                                                'borrow_date',
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={errors.borrow_date} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) =>
                                            setData('due_date', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.due_date} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Books</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addItem}
                                    >
                                        Add Book
                                    </Button>
                                </div>
                                {data.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 rounded-md border p-3"
                                    >
                                        <Select
                                            value={
                                                item.book_id
                                                    ? String(item.book_id)
                                                    : ''
                                            }
                                            onValueChange={(v) =>
                                                updateItem(
                                                    index,
                                                    'book_id',
                                                    v ? Number(v) : ''
                                                )
                                            }
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select book" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {books.map((b) => (
                                                    <SelectItem
                                                        key={b.id}
                                                        value={String(b.id)}
                                                    >
                                                        {b.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'quantity',
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ) || 0
                                                )
                                            }
                                            className="w-20"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeItem(index)}
                                            disabled={data.items.length === 1}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                                <InputError message={errors.items} />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        validItems.length === 0 ||
                                        !data.student_id
                                    }
                                >
                                    Create Borrow Record
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
