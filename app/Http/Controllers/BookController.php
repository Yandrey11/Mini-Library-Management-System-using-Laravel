<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Models\Author;
use App\Models\Book;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $books = Book::with('authors')->latest()->paginate(10);

        return Inertia::render('books/index', [
            'books' => $books,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $authors = Author::orderBy('name')->get();

        return Inertia::render('books/create', [
            'authors' => $authors,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $totalInventory = (int) ($validated['total_inventory'] ?? 0);
        $authorIds = $validated['author_ids'] ?? [];

        $book = Book::create([
            'title' => $validated['title'],
            'isbn' => $validated['isbn'] ?? null,
            'total_inventory' => $totalInventory,
            'available_inventory' => $totalInventory,
        ]);

        $book->authors()->sync($authorIds);

        return redirect()->route('books.index')
            ->with('success', 'Book created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book): Response
    {
        $book->load('authors');

        return Inertia::render('books/show', [
            'book' => $book,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book): Response
    {
        $book->load('authors');
        $authors = Author::orderBy('name')->get();

        return Inertia::render('books/edit', [
            'book' => $book,
            'authors' => $authors,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $book): RedirectResponse
    {
        $validated = $request->validated();
        $totalInventory = (int) ($validated['total_inventory'] ?? 0);
        $authorIds = $validated['author_ids'] ?? [];

        if ($totalInventory < $book->available_inventory) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Total inventory cannot be less than available inventory (currently borrowed).');
        }

        $book->update([
            'title' => $validated['title'],
            'isbn' => $validated['isbn'] ?? null,
            'total_inventory' => $totalInventory,
        ]);

        $book->authors()->sync($authorIds);

        return redirect()->route('books.index')
            ->with('success', 'Book updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book): RedirectResponse
    {
        if ($book->available_inventory < $book->total_inventory) {
            return redirect()->route('books.index')
                ->with('error', 'Cannot delete book with active borrows.');
        }

        $book->delete();

        return redirect()->route('books.index')
            ->with('success', 'Book deleted successfully.');
    }
}
