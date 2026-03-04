<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Library Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @if (session('success'))
                <div class="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                    {{ session('success') }}
                </div>
            @endif
            @if (session('error'))
                <div class="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                    {{ session('error') }}
                </div>
            @endif

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <a href="{{ route('students.index') }}" class="block p-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition">
                    <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ $stats['students'] }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Students</div>
                </a>
                <a href="{{ route('books.index') }}" class="block p-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition">
                    <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ $stats['books'] }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Books</div>
                </a>
                <a href="{{ route('authors.index') }}" class="block p-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition">
                    <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ $stats['authors'] }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Authors</div>
                </a>
                <a href="{{ route('borrow-records.index') }}" class="block p-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ $stats['active_borrows'] }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Active Borrows</div>
                </a>
                <div class="block p-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="text-2xl font-bold {{ $stats['overdue_borrows'] > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400' }}">
                        {{ $stats['overdue_borrows'] }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
                </div>
            </div>

            <!-- Recent Borrows -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Recent Borrow Records</h3>
                    @if ($recentBorrows->isEmpty())
                        <p class="text-gray-500 dark:text-gray-400">No borrow records yet.</p>
                    @else
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Student</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Books</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Due Date</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                    @foreach ($recentBorrows as $record)
                                        <tr>
                                            <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{{ $record->student->name }}</td>
                                            <td class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                                {{ $record->items->pluck('book.title')->join(', ') }}
                                            </td>
                                            <td class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{{ $record->due_date->format('M d, Y') }}</td>
                                            <td>
                                                <span class="px-2 py-1 text-xs rounded-full
                                                    @if($record->status === 'returned') bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400
                                                    @elseif($record->status === 'partial') bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400
                                                    @else bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400 @endif">
                                                    {{ ucfirst($record->status) }}
                                                </span>
                                            </td>
                                            <td class="px-4 py-2">
                                                <a href="{{ route('borrow-records.show', $record) }}" class="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">View</a>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
