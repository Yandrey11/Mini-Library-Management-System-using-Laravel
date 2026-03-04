<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Add Book') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    @if (session('error'))
                        <div class="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">{{ session('error') }}</div>
                    @endif
                    <form action="{{ route('books.store') }}" method="POST" class="space-y-4 max-w-md">
                        @csrf
                        <div>
                            <x-input-label for="title" :value="__('Title')" />
                            <x-text-input id="title" name="title" type="text" class="mt-1 block w-full" :value="old('title')" required />
                            <x-input-error :messages="$errors->get('title')" class="mt-2" />
                        </div>
                        <div>
                            <x-input-label for="isbn" :value="__('ISBN')" />
                            <x-text-input id="isbn" name="isbn" type="text" class="mt-1 block w-full" :value="old('isbn')" />
                            <x-input-error :messages="$errors->get('isbn')" class="mt-2" />
                        </div>
                        <div>
                            <x-input-label for="total_inventory" :value="__('Total Inventory')" />
                            <x-text-input id="total_inventory" name="total_inventory" type="number" min="0" class="mt-1 block w-full" :value="old('total_inventory', 0)" required />
                            <x-input-error :messages="$errors->get('total_inventory')" class="mt-2" />
                        </div>
                        <div>
                            <x-input-label :value="__('Authors')" />
                            <div class="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-md p-3">
                                @foreach ($authors as $author)
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" name="author_ids[]" value="{{ $author->id }}" {{ in_array($author->id, old('author_ids', [])) ? 'checked' : '' }}
                                            class="rounded border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-500">
                                        <span class="text-sm text-gray-900 dark:text-gray-100">{{ $author->name }}</span>
                                    </label>
                                @endforeach
                            </div>
                            <x-input-error :messages="$errors->get('author_ids')" class="mt-2" />
                        </div>
                        <div class="flex gap-2">
                            <x-primary-button>Create Book</x-primary-button>
                            <a href="{{ route('books.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
