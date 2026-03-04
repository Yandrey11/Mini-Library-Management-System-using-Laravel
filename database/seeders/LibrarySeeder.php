<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Student;
use Illuminate\Database\Seeder;

class LibrarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authors = [
            Author::create(['name' => 'J.K. Rowling']),
            Author::create(['name' => 'George R.R. Martin']),
            Author::create(['name' => 'J.R.R. Tolkien']),
            Author::create(['name' => 'Stephen King']),
            Author::create(['name' => 'Agatha Christie']),
        ];

        $books = [
            Book::create([
                'title' => 'Harry Potter and the Philosopher\'s Stone',
                'isbn' => '978-0747532699',
                'total_inventory' => 5,
                'available_inventory' => 5,
            ]),
            Book::create([
                'title' => 'A Game of Thrones',
                'isbn' => '978-0553103540',
                'total_inventory' => 3,
                'available_inventory' => 3,
            ]),
            Book::create([
                'title' => 'The Lord of the Rings',
                'isbn' => '978-0544003415',
                'total_inventory' => 4,
                'available_inventory' => 4,
            ]),
            Book::create([
                'title' => 'The Shining',
                'isbn' => '978-0307743657',
                'total_inventory' => 2,
                'available_inventory' => 2,
            ]),
            Book::create([
                'title' => 'Murder on the Orient Express',
                'isbn' => '978-0062693662',
                'total_inventory' => 3,
                'available_inventory' => 3,
            ]),
        ];

        $books[0]->authors()->attach([$authors[0]->id]);
        $books[1]->authors()->attach([$authors[1]->id]);
        $books[2]->authors()->attach([$authors[2]->id]);
        $books[3]->authors()->attach([$authors[3]->id]);
        $books[4]->authors()->attach([$authors[4]->id]);

        Student::insert([
            ['student_id' => '2024-001', 'name' => 'Juan Dela Cruz', 'email' => 'juan@example.com', 'phone' => '09171234567', 'created_at' => now(), 'updated_at' => now()],
            ['student_id' => '2024-002', 'name' => 'Maria Santos', 'email' => 'maria@example.com', 'phone' => '09187654321', 'created_at' => now(), 'updated_at' => now()],
            ['student_id' => '2024-003', 'name' => 'Pedro Reyes', 'email' => 'pedro@example.com', 'phone' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
