<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Borrow Record Details') }}
            </h2>
            <div class="space-x-2">
                @if ($borrowRecord->status !== 'returned')
                    <a href="{{ route('borrow-records.edit', $borrowRecord) }}" class="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700">
                        Return Books
                    </a>
                @endif
                <a href="{{ route('borrow-records.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600">
                    Back
                </a>
            </div>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            @if (session('success'))
                <div class="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">{{ session('success') }}</div>
            @endif

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Student</dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                <a href="{{ route('students.show', $borrowRecord->student) }}" class="text-indigo-600 dark:text-indigo-400 hover:underline">{{ $borrowRecord->student->name }}</a>{{ ' (' . $borrowRecord->student->student_id . ')' }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Borrow Date</dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ $borrowRecord->borrow_date->format('M d, Y') }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ $borrowRecord->due_date->format('M d, Y') }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Return Date</dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ $borrowRecord->return_date?->format('M d, Y') ?? '-' }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                            <dd class="mt-1">
                                <span class="px-2 py-1 text-xs rounded-full
                                    @if($borrowRecord->status === 'returned') bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400
                                    @elseif($borrowRecord->status === 'partial') bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400
                                    @else bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400 @endif">
                                    {{ ucfirst($borrowRecord->status) }}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fine</dt>
                            <dd class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                ₱{{ number_format($borrowRecord->status === 'returned' ? $borrowRecord->total_fine : $calculatedFine, 2) }}
                                @if ($borrowRecord->status !== 'returned' && $calculatedFine > 0)
                                    <span class="text-sm font-normal text-amber-600 dark:text-amber-400">(₱10/day/book)</span>
                                @endif
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Books</h3>
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Book</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Borrowed</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Returned</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Outstanding</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            @foreach ($borrowRecord->items as $item)
                                <tr>
                                    <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                                        <a href="{{ route('books.show', $item->book) }}" class="text-indigo-600 dark:text-indigo-400 hover:underline">{{ $item->book->title }}</a>
                                    </td>
                                    <td class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{{ $item->quantity }}</td>
                                    <td class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{{ $item->returned_quantity }} @if($item->returned_at)({{ $item->returned_at->format('M d, Y') }})@endif</td>
                                    <td class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{{ $item->quantity - $item->returned_quantity }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
