<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReturnBorrowRecordRequest;
use App\Http\Requests\StoreBorrowRecordRequest;
use App\Models\Book;
use App\Models\BorrowRecord;
use App\Models\Student;
use App\Services\BorrowRecordService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BorrowRecordController extends Controller
{
    public function __construct(
        private BorrowRecordService $borrowRecordService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $borrowRecords = BorrowRecord::with(['student', 'items.book'])
            ->latest()
            ->paginate(10);

        return Inertia::render('borrow-records/index', [
            'borrowRecords' => $borrowRecords,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $students = Student::orderBy('name')->get();
        $books = Book::with('authors')->orderBy('title')->get();

        return Inertia::render('borrow-records/create', [
            'students' => $students,
            'books' => $books,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBorrowRecordRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();
            $student = Student::findOrFail($validated['student_id']);

            $items = [];
            foreach ($validated['items'] as $item) {
                $bookId = $item['book_id'];
                $qty = (int) $item['quantity'];
                $items[$bookId] = ($items[$bookId] ?? 0) + $qty;
            }

            $this->borrowRecordService->createBorrowRecord(
                $student,
                $items,
                Carbon::parse($validated['borrow_date']),
                Carbon::parse($validated['due_date'])
            );

            return redirect()->route('borrow-records.index')
                ->with('success', 'Borrow record created successfully.');
        } catch (\InvalidArgumentException $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BorrowRecord $borrowRecord): Response
    {
        $borrowRecord->load(['student', 'items.book']);
        $calculatedFine = $this->borrowRecordService->calculateFine($borrowRecord);

        return Inertia::render('borrow-records/show', [
            'borrowRecord' => $borrowRecord,
            'calculatedFine' => $calculatedFine,
        ]);
    }

    /**
     * Show the form for returning books (partial or full).
     */
    public function edit(BorrowRecord $borrowRecord): Response
    {
        if ($borrowRecord->status === 'returned') {
            return redirect()->route('borrow-records.show', $borrowRecord)
                ->with('info', 'This borrow has already been fully returned.');
        }

        $borrowRecord->load(['student', 'items.book']);
        $calculatedFine = $this->borrowRecordService->calculateFine($borrowRecord);

        return Inertia::render('borrow-records/edit', [
            'borrowRecord' => $borrowRecord,
            'calculatedFine' => $calculatedFine,
        ]);
    }

    /**
     * Process return (partial or full).
     */
    public function update(ReturnBorrowRecordRequest $request, BorrowRecord $borrowRecord): RedirectResponse
    {
        if ($borrowRecord->status === 'returned') {
            return redirect()->route('borrow-records.index')
                ->with('info', 'This borrow has already been fully returned.');
        }

        $returns = $request->validated('returns');

        $validReturns = [];
        foreach ($borrowRecord->items as $item) {
            $qty = (int) ($returns[$item->id] ?? 0);
            $maxReturnable = $item->quantity - $item->returned_quantity;
            if ($qty > 0 && $maxReturnable > 0) {
                $validReturns[$item->book_id] = min($qty, $maxReturnable);
            }
        }

        if (empty($validReturns)) {
            return redirect()->back()
                ->with('error', 'Please specify at least one book to return.');
        }

        $this->borrowRecordService->processReturn($borrowRecord, $validReturns);

        return redirect()->route('borrow-records.show', $borrowRecord)
            ->with('success', 'Books returned successfully. Fine calculated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BorrowRecord $borrowRecord): RedirectResponse
    {
        if ($borrowRecord->status !== 'returned') {
            return redirect()->route('borrow-records.index')
                ->with('error', 'Cannot delete borrow record with outstanding books.');
        }

        $borrowRecord->delete();

        return redirect()->route('borrow-records.index')
            ->with('success', 'Borrow record deleted successfully.');
    }
}
