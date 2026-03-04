# Mini Library Management System - Documentation

## Database Design

### Schema Structure

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  students   │     │  borrow_records  │     │    books    │
├─────────────┤     ├──────────────────┤     ├─────────────┤
│ id          │◄────│ student_id (FK)  │     │ id          │
│ student_id   │     │ borrow_date      │     │ title       │
│ name        │     │ due_date         │     │ isbn        │
│ email       │     │ return_date      │     │ total_inv   │
│ phone       │     │ total_fine       │     │ available   │
└─────────────┘     │ status           │     └──────┬──────┘
                    └────────┬─────────┘            │
                             │                      │
                             │     ┌────────────────┴────────────┐
                             │     │  borrow_record_items         │
                             └────►├──────────────────────────────┤
                                   │ borrow_record_id (FK)        │
                                   │ book_id (FK)                 │
                                   │ quantity                     │
                                   │ returned_quantity            │
                                   │ returned_at                  │
                                   └──────────────────────────────┘

┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   authors   │     │   book_author     │     │    books    │
├─────────────┤     │   (pivot)         │     ├─────────────┤
│ id          │◄────│ book_id (FK)      │────►│ id          │
│ name        │     │ author_id (FK)   │     │ ...         │
└─────────────┘     └──────────────────┘     └─────────────┘
```

### Relationships

- **One-to-Many**: Student → BorrowRecord (a student has many borrow records)
- **One-to-Many**: BorrowRecord → BorrowRecordItem (a borrow has many items/books)
- **Many-to-Many**: Book ↔ Author (via `book_author` pivot table)

### Cascade Rules

- `book_author`: `cascadeOnDelete` on both foreign keys
- `borrow_records`: `restrictOnDelete` on student_id (cannot delete student with active borrows)
- `borrow_record_items`: `cascadeOnDelete` on borrow_record_id, `restrictOnDelete` on book_id

---

## Migrations

| Migration | Purpose |
|-----------|---------|
| `create_students_table` | Students (student_id, name, email, phone) |
| `create_authors_table` | Authors (name) |
| `create_books_table` | Books (title, isbn, total_inventory, available_inventory) |
| `create_book_author_table` | Pivot for Book ↔ Author many-to-many |
| `create_borrow_records_table` | Borrow transactions (student_id, dates, fine, status) |
| `create_borrow_record_items_table` | Per-book items in a borrow (quantity, returned_quantity) |

---

## Models & Relationships

| Model | Relationships |
|-------|---------------|
| **Student** | `hasMany(BorrowRecord)` |
| **Author** | `belongsToMany(Book)` via `book_author` |
| **Book** | `belongsToMany(Author)`, `hasMany(BorrowRecordItem)` |
| **BorrowRecord** | `belongsTo(Student)`, `hasMany(BorrowRecordItem)` |
| **BorrowRecordItem** | `belongsTo(BorrowRecord)`, `belongsTo(Book)` |

---

## Controllers

| Controller | Methods | Purpose |
|------------|---------|---------|
| **DashboardController** | `__invoke` | Stats + recent borrows |
| **StudentController** | index, create, store, show, edit, update, destroy | Full CRUD |
| **AuthorController** | index, create, store, show, edit, update, destroy | Full CRUD |
| **BookController** | index, create, store, show, edit, update, destroy | Full CRUD + author sync |
| **BorrowRecordController** | index, create, store, show, edit, update, destroy | CRUD + return (edit = return form) |

---

## Routes

```
GET    /dashboard              → Dashboard
GET    /students               → Student index
POST   /students               → Store student
GET    /students/create        → Create form
GET    /students/{id}         → Show student
GET    /students/{id}/edit    → Edit form
PUT    /students/{id}         → Update student
DELETE /students/{id}         → Delete student

GET    /books                  → Book index
POST   /books                  → Store book
GET    /books/create           → Create form
GET    /books/{id}             → Show book
GET    /books/{id}/edit        → Edit form
PUT    /books/{id}             → Update book
DELETE /books/{id}             → Delete book

GET    /authors                → Author index
... (same pattern)

GET    /borrow-records         → Borrow index
POST   /borrow-records         → Create borrow
GET    /borrow-records/create  → Create form
GET    /borrow-records/{id}    → Show borrow
GET    /borrow-records/{id}/edit → Return form (partial/full)
PUT    /borrow-records/{id}    → Process return
DELETE /borrow-records/{id}    → Delete (only if fully returned)
```

---

## Views Structure

```
resources/views/
├── layouts/
│   ├── app.blade.php
│   ├── guest.blade.php
│   └── navigation.blade.php
├── dashboard.blade.php
├── students/
│   ├── index.blade.php
│   ├── create.blade.php
│   ├── edit.blade.php
│   └── show.blade.php
├── books/
│   ├── index.blade.php
│   ├── create.blade.php
│   ├── edit.blade.php
│   └── show.blade.php
├── authors/
│   ├── index.blade.php
│   ├── create.blade.php
│   ├── edit.blade.php
│   └── show.blade.php
├── borrow-records/
│   ├── index.blade.php
│   ├── create.blade.php
│   ├── edit.blade.php   (Return form)
│   └── show.blade.php
└── auth/
    ├── login.blade.php
    └── ...
```

---

## Business Logic

### Fine Computation

**Formula**: `Fine = ₱10 × number of overdue days × number of books`

- Overdue days = `max(0, return_date - due_date)` (in days)
- For **partial returns**: each book/item is charged based on its effective return date
  - Returned copies: use `returned_at`
  - Outstanding copies: use today when calculating display fine; use actual return date when processing

### Inventory

- On **borrow**: `available_inventory` decreases by quantity borrowed
- On **return**: `available_inventory` increases by quantity returned
- `total_inventory` is fixed; `available_inventory` = total minus currently borrowed

### BorrowRecordService

- `createBorrowRecord()`: Creates borrow + items, decrements book inventory
- `processReturn()`: Updates returned_quantity, increments inventory, recalculates fine
- `recalculateFineAndStatus()`: Computes total fine, updates status (borrowed/partial/returned)
- `calculateFine()`: Returns current fine for display (before return)

---

## Authentication

- **Laravel Fortify** (Breeze-style): Login, Register, Forgot/Reset Password
- **Change Password**: `/settings/password` (Blade)
- No RBAC; all authenticated users have full access
