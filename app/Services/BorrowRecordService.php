<?php

namespace App\Services;

use App\Models\Book;
use App\Models\BorrowRecord;
use App\Models\BorrowRecordItem;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BorrowRecordService
{
    /**
     * Create a new borrow record for a student with multiple books.
     */
    public function createBorrowRecord(Student $student, array $items, Carbon $borrowDate, Carbon $dueDate): BorrowRecord
    {
        return DB::transaction(function () use ($student, $items, $borrowDate, $dueDate) {
            $borrowRecord = BorrowRecord::create([
                'student_id' => $student->id,
                'borrow_date' => $borrowDate,
                'due_date' => $dueDate,
                'status' => 'borrowed',
            ]);

            foreach ($items as $bookId => $quantity) {
                $book = Book::findOrFail($bookId);

                if ($book->available_inventory < $quantity) {
                    throw new \InvalidArgumentException(
                        "Insufficient inventory for '{$book->title}'. Available: {$book->available_inventory}"
                    );
                }

                BorrowRecordItem::create([
                    'borrow_record_id' => $borrowRecord->id,
                    'book_id' => $bookId,
                    'quantity' => $quantity,
                ]);

                $book->decrement('available_inventory', $quantity);
            }

            return $borrowRecord->fresh(['items.book', 'student']);
        });
    }

    /**
     * Process partial or full return of books.
     *
     * @param  array<int, int>  $returns  [book_id => quantity_to_return]
     */
    public function processReturn(BorrowRecord $borrowRecord, array $returns): BorrowRecord
    {
        return DB::transaction(function () use ($borrowRecord, $returns) {
            $returnDate = Carbon::today();

            foreach ($returns as $bookId => $quantityToReturn) {
                if ($quantityToReturn <= 0) {
                    continue;
                }

                $item = $borrowRecord->items()->where('book_id', $bookId)->firstOrFail();

                $newReturnedQty = min($item->returned_quantity + $quantityToReturn, $item->quantity);
                $actualReturned = $newReturnedQty - $item->returned_quantity;

                if ($actualReturned <= 0) {
                    continue;
                }

                $item->update([
                    'returned_quantity' => $newReturnedQty,
                    'returned_at' => $item->returned_at ?? $returnDate,
                ]);

                Book::where('id', $bookId)->increment('available_inventory', $actualReturned);
            }

            $borrowRecord->refresh();
            $this->recalculateFineAndStatus($borrowRecord);

            return $borrowRecord->fresh(['items.book', 'student']);
        });
    }

    /**
     * Recalculate total fine and update status based on returned items.
     * Fine = ₱10 × overdue_days × quantity (per book, using return date or today for outstanding).
     */
    public function recalculateFineAndStatus(BorrowRecord $borrowRecord): void
    {
        $totalFine = 0;
        $allReturned = true;
        $anyReturned = false;
        $today = Carbon::today();

        foreach ($borrowRecord->items as $item) {
            if ($item->returned_quantity > 0) {
                $returnedOverdue = $this->calculateOverdueDays(
                    $borrowRecord->due_date,
                    $item->returned_at ?? $today
                );
                $totalFine += BorrowRecord::FINE_PER_DAY_PER_BOOK * $returnedOverdue * $item->returned_quantity;
            }
            if ($item->returned_quantity < $item->quantity) {
                $outstandingOverdue = $this->calculateOverdueDays($borrowRecord->due_date, $today);
                $totalFine += BorrowRecord::FINE_PER_DAY_PER_BOOK * $outstandingOverdue * ($item->quantity - $item->returned_quantity);
                $allReturned = false;
            }
            if ($item->returned_quantity > 0) {
                $anyReturned = true;
            }
        }

        $status = $allReturned ? 'returned' : ($anyReturned ? 'partial' : 'borrowed');
        $returnDate = $allReturned ? $today : null;

        $borrowRecord->update([
            'total_fine' => $totalFine,
            'status' => $status,
            'return_date' => $returnDate ?? $borrowRecord->return_date,
        ]);
    }

    /**
     * Calculate overdue days. Returns 0 if not overdue.
     */
    public function calculateOverdueDays(Carbon $dueDate, ?Carbon $returnDate = null): int
    {
        $effectiveDate = $returnDate ?? Carbon::today();
        $days = $dueDate->diffInDays($effectiveDate, false);

        return max(0, (int) $days);
    }

    /**
     * Get calculated fine for a borrow record (for display before return).
     * Fine = ₱10 × overdue_days × number of books.
     */
    public function calculateFine(BorrowRecord $borrowRecord): float
    {
        $totalFine = 0;
        $today = Carbon::today();

        foreach ($borrowRecord->items as $item) {
            if ($item->returned_quantity > 0) {
                $returnedOverdue = $this->calculateOverdueDays(
                    $borrowRecord->due_date,
                    $item->returned_at ?? $today
                );
                $totalFine += BorrowRecord::FINE_PER_DAY_PER_BOOK * $returnedOverdue * $item->returned_quantity;
            }
            $outstandingQty = $item->quantity - $item->returned_quantity;
            if ($outstandingQty > 0) {
                $outstandingOverdue = $this->calculateOverdueDays($borrowRecord->due_date, $today);
                $totalFine += BorrowRecord::FINE_PER_DAY_PER_BOOK * $outstandingOverdue * $outstandingQty;
            }
        }

        return (float) $totalFine;
    }
}
