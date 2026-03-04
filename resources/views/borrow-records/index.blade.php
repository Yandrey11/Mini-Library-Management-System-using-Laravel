<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Borrow Records') }}
            </h2>
            <a href="{{ route('borrow-records.create') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700">
                New Borrow
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @if (session('success'))
                <div class="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">{{ session('success') }}</div>
            @endif
            @if (session('error'))
                <div class="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">{{ session('error') }}</div>
            @endif
            @if (session('info'))
                <div class="mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg">{{ session('info') }}</div>
            @endif

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    @if ($borrowRecords->isEmpty())
                        <p class="text-gray-500 dark:text-gray-400">No borrow records yet. <a href="{{ route('borrow-records.create') }}" class="text-indigo-600 hover:underline">Create one</a>.</p>
                    @else
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Student</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Borrow Date</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Due Date</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Books</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fine</th>
                                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                @foreach ($borrowRecords as $record)
                                    <tr>
                                        <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ $record->student->name }}</td>
                                        <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ $record->borrow_date->format('M d, Y') }}</td>
                                        <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ $record->due_date->format('M d, Y') }}</td>
                                        <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ $record->items->pluck('book.title')->join(', ') }}</td>
                                        <td>
                                            <span class="px-2 py-1 text-xs rounded-full
                                                @if($record->status === 'returned') bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400
                                                @elseif($record->status === 'partial') bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400
                                                @else bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400 @endif">
                                                {{ ucfirst($record->status) }}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">₱{{ number_format($record->total_fine, 2) }}</td>
                                        <td class="px-4 py-3 text-right text-sm space-x-2">
                                            <a href="{{ route('borrow-records.show', $record) }}" class="text-indigo-600 dark:text-indigo-400 hover:underline">View</a>
                                            @if ($record->status !== 'returned')
                                                <a href="{{ route('borrow-records.edit', $record) }}" class="text-emerald-600 dark:text-emerald-400 hover:underline">Return</a>
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                        <div class="mt-4">{{ $borrowRecords->links() }}</div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
