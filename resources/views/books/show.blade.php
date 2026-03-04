<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Book Details') }}
            </h2>
            <div class="space-x-2">
                <a href="{{ route('books.edit', $book) }}" class="inline-flex items-center px-4 py-2 bg-amber-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-700">
                    Edit
                </a>
                <a href="{{ route('books.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600">
                    Back
                </a>
            </div>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Title</dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ $book->title }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">ISBN</dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ $book->isbn ?? '-' }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Inventory</dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ $book->total_inventory }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Available</dt>
                            <dd class="mt-1 text-sm {{ $book->available_inventory > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' }}">
                                {{ $book->available_inventory }}
                            </dd>
                        </div>
                        <div class="sm:col-span-2">
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Authors</dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                @if ($book->authors->isEmpty())
                                    -
                                @else
                                    @foreach ($book->authors as $author)
                                        <a href="{{ route('authors.show', $author) }}" class="text-indigo-600 dark:text-indigo-400 hover:underline">{{ $author->name }}</a>{{ !$loop->last ? ', ' : '' }}
                                    @endforeach
                                @endif
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
