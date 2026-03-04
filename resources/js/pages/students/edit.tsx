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
    index as indexRoute,
    show as showRoute,
    update,
} from '@/routes/students';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface Student {
    id: number;
    student_id: string;
    name: string;
    email: string;
    phone: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Students', href: indexRoute.url() },
];

export default function StudentsEdit({ student }: { student: Student }) {
    const breadcrumbsWithEdit: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: student.name, href: showRoute.url(student) },
        { title: 'Edit', href: update.url(student) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        student_id: student.student_id,
        name: student.name,
        email: student.email,
        phone: student.phone ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbsWithEdit}>
            <Head title={`Edit ${student.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Edit Student
                    </h1>
                    <p className="text-muted-foreground">
                        Update student information
                    </p>
                </div>

                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Student Information</CardTitle>
                        <CardDescription>
                            Update the student details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                put(update.url(student));
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="student_id">Student ID</Label>
                                <Input
                                    id="student_id"
                                    value={data.student_id}
                                    onChange={(e) =>
                                        setData('student_id', e.target.value)
                                    }
                                    required
                                    autoComplete="off"
                                />
                                <InputError message={errors.student_id} />
                            </div>
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
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                />
                                <InputError message={errors.phone} />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Update Student
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={showRoute.url(student)}>
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
