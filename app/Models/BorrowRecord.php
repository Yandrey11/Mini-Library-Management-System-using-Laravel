<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BorrowRecord extends Model
{
    public const FINE_PER_DAY_PER_BOOK = 10;

    protected $fillable = [
        'student_id',
        'borrow_date',
        'due_date',
        'return_date',
        'total_fine',
        'status',
    ];

    protected $casts = [
        'borrow_date' => 'date',
        'due_date' => 'date',
        'return_date' => 'date',
        'total_fine' => 'decimal:2',
    ];

    /**
     * Get the student that owns the borrow record.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the borrow record items (books borrowed).
     */
    public function items(): HasMany
    {
        return $this->hasMany(BorrowRecordItem::class, 'borrow_record_id');
    }
}
