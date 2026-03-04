<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Return Books') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @if (session('error'))
                <div class="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">{{ session('error') }}</div>
            @endif

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div class="p-6">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Student: <strong>{{ $borrowRecord->student->name }}</strong> | Due: {{ $borrowRecord->due_date->format('M d, Y') }}
                        @if ($calculatedFine > 0)
                            | <span class="text-amber-600 dark:text-amber-400">Estimated fine: ₱{{ number_format($calculatedFine, 2) }} (₱10/day/book)</span>
                        @endif
                    </p>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <form action="{{ route('borrow-records.update', $borrowRecord) }}" method="POST">
                        @csrf
                        @method('PUT')
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Book</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Borrowed</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Already Returned</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Return Now</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                @foreach ($borrowRecord->items as $item)
                                    @if ($item->returned_quantity < $item->quantity)
                                        <tr>
                                            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ $item->book->title }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ $item->quantity }}</td>
                                            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ $item->returned_quantity }}</td>
                                            <td class="px-4 py-3">
                                                <input type="number" name="returns[{{ $item->id }}]" min="0" max="{{ $item->quantity - $item->returned_quantity }}"
                                                    value="{{ $item->quantity - $item->returned_quantity }}"
                                                    class="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm w-20">
                                            </td>
                                        </tr>
                                    @endif
                                @endforeach
                            </tbody>
                        </table>
                        <div class="mt-4 flex gap-2">
                            <x-primary-button>Process Return</x-primary-button>
                            <a href="{{ route('borrow-records.show', $borrowRecord) }}" class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
