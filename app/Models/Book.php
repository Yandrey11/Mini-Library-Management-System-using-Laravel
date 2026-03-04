<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'title',
        'isbn',
        'total_inventory',
        'available_inventory',
    ];

    protected $casts = [
        'total_inventory' => 'integer',
        'available_inventory' => 'integer',
    ];

    /**
     * Get the authors of the book.
     */
    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class, 'book_author')
            ->withTimestamps();
    }

    /**
     * Get the borrow record items for the book.
     */
    public function borrowRecordItems(): HasMany
    {
        return $this->hasMany(BorrowRecordItem::class);
    }
}
