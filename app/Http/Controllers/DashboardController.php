<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Book;
use App\Models\BorrowRecord;
use App\Models\Student;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function __invoke(): Response
    {
        $stats = [
            'students' => Student::count(),
            'books' => Book::count(),
            'authors' => Author::count(),
            'active_borrows' => BorrowRecord::whereIn('status', ['borrowed', 'partial'])->count(),
            'overdue_borrows' => BorrowRecord::whereIn('status', ['borrowed', 'partial'])
                ->where('due_date', '<', now()->toDateString())
                ->count(),
        ];

        $recentBorrows = BorrowRecord::with(['student', 'items.book'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentBorrows' => $recentBorrows,
        ]);
    }
}
