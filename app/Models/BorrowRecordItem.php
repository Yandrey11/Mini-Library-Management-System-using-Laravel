<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BorrowRecordItem extends Model
{
    protected $fillable = [
        'borrow_record_id',
        'book_id',
        'quantity',
        'returned_quantity',
        'returned_at',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'returned_quantity' => 'integer',
        'returned_at' => 'datetime',
    ];

    /**
     * Get the borrow record that owns the item.
     */
    public function borrowRecord(): BelongsTo
    {
        return $this->belongsTo(BorrowRecord::class);
    }

    /**
     * Get the book.
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
