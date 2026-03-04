<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('New Borrow Record') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    @if (session('error'))
                        <div class="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">{{ session('error') }}</div>
                    @endif
                    <form action="{{ route('borrow-records.store') }}" method="POST" class="space-y-4" id="borrow-form">
                        @csrf
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                            <div>
                                <x-input-label for="student_id" :value="__('Student')" />
                                <select id="student_id" name="student_id" required class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">
                                    <option value="">Select student...</option>
                                    @foreach ($students as $student)
                                        <option value="{{ $student->id }}" {{ old('student_id') == $student->id ? 'selected' : '' }}>{{ $student->name }} ({{ $student->student_id }})</option>
                                    @endforeach
                                </select>
                                <x-input-error :messages="$errors->get('student_id')" class="mt-2" />
                            </div>
                            <div>
                                <x-input-label for="borrow_date" :value="__('Borrow Date')" />
                                <x-text-input id="borrow_date" name="borrow_date" type="date" class="mt-1 block w-full" :value="old('borrow_date', date('Y-m-d'))" required />
                                <x-input-error :messages="$errors->get('borrow_date')" class="mt-2" />
                            </div>
                            <div>
                                <x-input-label for="due_date" :value="__('Due Date')" />
                                <x-text-input id="due_date" name="due_date" type="date" class="mt-1 block w-full" :value="old('due_date')" required />
                                <x-input-error :messages="$errors->get('due_date')" class="mt-2" />
                            </div>
                        </div>

                        <div>
                            <x-input-label :value="__('Books to Borrow')" />
                            <div id="items-container" class="mt-2 space-y-2">
                                <div class="flex gap-2 items-end">
                                    <div class="flex-1">
                                        <select name="items[0][book_id]" class="block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">
                                            <option value="">Select book...</option>
                                            @foreach ($books as $book)
                                                <option value="{{ $book->id }}" {{ old('items.0.book_id') == $book->id ? 'selected' : '' }} data-available="{{ $book->available_inventory }}">
                                                    {{ $book->title }} ({{ $book->available_inventory }} available)
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="w-24">
                                        <x-text-input name="items[0][quantity]" type="number" min="1" :value="old('items.0.quantity', 1)" placeholder="Qty" />
                                    </div>
                                    <button type="button" class="remove-item hidden px-3 py-2 bg-red-600 text-white rounded-md text-sm">Remove</button>
                                </div>
                            </div>
                            <button type="button" id="add-item" class="mt-2 inline-flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600">
                                + Add Book
                            </button>
                            <x-input-error :messages="$errors->get('items')" class="mt-2" />
                        </div>

                        <div class="flex gap-2">
                            <x-primary-button>Create Borrow Record</x-primary-button>
                            <a href="{{ route('borrow-records.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.getElementById('items-container');
            const addBtn = document.getElementById('add-item');
            const books = @json($books->map(fn($b) => ['id' => $b->id, 'title' => $b->title, 'available' => $b->available_inventory]));

            let index = 1;

            addBtn.addEventListener('click', function() {
                const div = document.createElement('div');
                div.className = 'flex gap-2 items-end';
                div.innerHTML = `
                    <div class="flex-1">
                        <select name="items[${index}][book_id]" class="block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm">
                            <option value="">Select book...</option>
                            ${books.map(b => `<option value="${b.id}" data-available="${b.available}">${b.title} (${b.available} available)</option>`).join('')}
                        </select>
                    </div>
                    <div class="w-24">
                        <input type="number" name="items[${index}][quantity]" min="1" value="1" placeholder="Qty" class="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm block w-full">
                    </div>
                    <button type="button" class="remove-item px-3 py-2 bg-red-600 text-white rounded-md text-sm">Remove</button>
                `;
                container.appendChild(div);
                index++;
                updateRemoveButtons();
            });

            container.addEventListener('click', function(e) {
                if (e.target.classList.contains('remove-item')) {
                    e.target.closest('.flex').remove();
                    updateRemoveButtons();
                }
            });

            function updateRemoveButtons() {
                const rows = container.querySelectorAll('.flex');
                rows.forEach((row, i) => {
                    const btn = row.querySelector('.remove-item');
                    if (btn) {
                        btn.classList.toggle('hidden', rows.length <= 1);
                    }
                });
            }
            updateRemoveButtons();
        });
    </script>
</x-app-layout>
