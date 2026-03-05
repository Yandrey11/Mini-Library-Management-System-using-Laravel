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
} from '@/routes/borrow-records';
import type { BreadcrumbItem } from '@/types';

interface Book {
    id: number;
    title: string;
}

interface BorrowRecordItem {
    id: number;
    book_id: number;
    book: Book;
    quantity: number;
    returned_quantity: number;
}

interface Student {
    id: number;
    name: string;
}

interface BorrowRecord {
    id: number;
    status: string;
    due_date: string;
    total_fine: number | string;
    student: Student;
    items: BorrowRecordItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Borrow Records', href: indexRoute.url() },
];

export default function BorrowRecordsEdit({
    borrowRecord,
    calculatedFine = 0,
}: {
    borrowRecord: BorrowRecord;
    calculatedFine?: number;
}) {
    const breadcrumbsWithEdit: BreadcrumbItem[] = [
        ...breadcrumbs,
        {
            title: `Borrow #${borrowRecord.id}`,
            href: showRoute.url(borrowRecord.id),
        },
        { title: 'Return', href: update.url(borrowRecord.id) },
    ];

    const initialReturns: Record<number, number> = {};
    borrowRecord.items.forEach((item) => {
        const maxReturnable =
            item.quantity - (item.returned_quantity ?? 0);
        if (maxReturnable > 0) {
            initialReturns[item.id] = 0;
        }
    });

    const { data, setData, put, processing, errors } = useForm({
        returns: initialReturns,
    });

    const hasReturnable = borrowRecord.items.some(
        (i) => i.quantity - (i.returned_quantity ?? 0) > 0
    );

    return (
        <AppLayout breadcrumbs={breadcrumbsWithEdit}>
            <Head title={`Return Books - ${borrowRecord.student.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Return Books
                    </h1>
                    <p className="text-muted-foreground">
                        Process return for {borrowRecord.student.name}
                    </p>
                </div>

                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Return Quantities</CardTitle>
                        <CardDescription>
                            Enter how many of each book to return. Calculated
                            fine: ₱{Number(calculatedFine).toFixed(2)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                put(update.url(borrowRecord.id));
                            }}
                            className="space-y-4"
                        >
                            {borrowRecord.items.map((item) => {
                                const maxReturnable =
                                    item.quantity -
                                    (item.returned_quantity ?? 0);
                                if (maxReturnable <= 0) return null;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 rounded-md border p-3"
                                    >
                                        <div className="flex-1">
                                            <span className="font-medium">
                                                {item.book.title}
                                            </span>
                                            <p className="text-sm text-muted-foreground">
                                                Returned:{' '}
                                                {item.returned_quantity ?? 0}/
                                                {item.quantity}. Max to return:{' '}
                                                {maxReturnable}
                                            </p>
                                        </div>
                                        <div className="w-24 space-y-1">
                                            <Label
                                                htmlFor={`return-${item.id}`}
                                                className="sr-only"
                                            >
                                                Quantity to return
                                            </Label>
                                            <Input
                                                id={`return-${item.id}`}
                                                type="number"
                                                min={0}
                                                max={maxReturnable}
                                                value={
                                                    data.returns[item.id] ?? 0
                                                }
                                                onChange={(e) => {
                                                    const val = parseInt(
                                                        e.target.value,
                                                        10
                                                    );
                                                    setData('returns', {
                                                        ...data.returns,
                                                        [item.id]:
                                                            isNaN(val) ||
                                                            val < 0
                                                                ? 0
                                                                : Math.min(
                                                                      val,
                                                                      maxReturnable
                                                                  ),
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            <InputError message={errors.returns} />
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !hasReturnable ||
                                        !Object.values(data.returns).some(
                                            (v) => v > 0
                                        )
                                    }
                                >
                                    Process Return
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={showRoute.url(borrowRecord.id)}>
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
