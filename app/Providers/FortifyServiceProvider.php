<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views (Inertia/React).
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => \Inertia\Inertia::render('auth/login', [
            'canResetPassword' => \Laravel\Fortify\Features::enabled(\Laravel\Fortify\Features::resetPasswords()),
            'canRegister' => \Laravel\Fortify\Features::enabled(\Laravel\Fortify\Features::registration()),
            'status' => $request->session()->get('status'),
        ]));
        Fortify::registerView(fn () => \Inertia\Inertia::render('auth/register'));
        Fortify::requestPasswordResetLinkView(fn (Request $request) => \Inertia\Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));
        Fortify::resetPasswordView(fn (Request $request) => \Inertia\Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));
        Fortify::verifyEmailView(fn (Request $request) => \Inertia\Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));
        Fortify::twoFactorChallengeView(fn () => \Inertia\Inertia::render('auth/two-factor-challenge'));
        Fortify::confirmPasswordView(fn () => \Inertia\Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
