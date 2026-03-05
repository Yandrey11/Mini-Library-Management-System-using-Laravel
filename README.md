# Mini Library Management System

A Laravel-based library system for managing students, books, authors, and borrowing/return transactions with overdue fine calculation.

## Tech Stack

- **Backend:** Laravel 12, PHP 8.2+
- **Frontend:** Inertia + React + TypeScript + Vite
- **Auth:** Laravel Fortify / Breeze-style auth flow
- **Database:** MySQL (or any Laravel-supported SQL database)

## Features

- Student, Author, and Book management (CRUD)
- Borrow and return workflows with item-level tracking
- Inventory tracking (`total_inventory` and `available_inventory`)
- Borrow status handling (`borrowed`, `partial`, `returned`)
- Fine computation for overdue returns
- Dashboard with key library activity summaries

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ and npm
- A configured SQL database

## Quick Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Update your `.env` database settings, then run:

```bash
php artisan migrate
npm install
```

## Run in Development

Use the combined dev script (server + queue + Vite):

```bash
composer run dev
```

Or run services separately:

```bash
php artisan serve
php artisan queue:listen --tries=1
npm run dev
```

## Build for Production

```bash
npm run build
```

## Testing and Quality Checks

```bash
php artisan test
composer run lint:check
npm run lint:check
npm run format:check
npm run types:check
```

## Project Structure (High Level)

- `app/Models` – Domain models (Student, Book, Author, BorrowRecord, BorrowRecordItem)
- `app/Services` – Business logic services (e.g., borrow/return processing)
- `app/Http/Controllers` – Application controllers
- `database/migrations` – Database schema definitions
- `resources` – Frontend assets and UI code
- `routes/web.php` – Web routes

## Business Rules Snapshot

- Borrowing decreases `available_inventory`
- Returning increases `available_inventory`
- Overdue fine is computed based on days past due date and returned quantity
- Borrow records can be fully or partially returned

## Documentation

For full schema and workflow details, see:

- `LIBRARY_SYSTEM_DOCUMENTATION.md`

## License

This project is open-source and follows the license declared in `composer.json`.
