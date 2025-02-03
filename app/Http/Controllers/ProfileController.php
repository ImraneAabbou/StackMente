<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\RegisterationRequest;
use App\Http\Requests\Profile\DeleteAccountRequest;
use App\Http\Requests\Profile\ProfileUpdateRequest;
use App\Models\User;
use App\Services\StatsService;
use App\Services\UserService;
use App\Traits\ReportableCtrl;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Str;

class ProfileController extends Controller
{
    use ReportableCtrl;

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterationRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $generatedUsername = UserService::generateUsernameFromFullname($validated['fullname']);

        User::create([
            ...$validated,
            'username' => $generatedUsername
        ]);

        return to_route('login')->with('status', __('status.account-created'));
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Authenticatable $user): Response
    {
        return Inertia::render('Profile/Edit', [
            'auth' => [
                'user' => [
                    'hasPassword' => !!$user->password,
                ]
            ]
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        $validated['avatar'] =
            $validated['avatar']
                ? basename($validated['avatar']->store('users', 'images'))
                : null;

        $validated = array_filter($validated);

        $user->update(
            $validated,
        );

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return back()->with('status', 'informations-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(DeleteAccountRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->username = "deleted-" . Str::uuid();
        $user->fullname = $user->username;
        $user->email = $user->username . "@stackmente.com";
        $user->password = null;
        $user->email_verified_at = null;
        $user->avatar = "";
        $user->providers = [];
        (new StatsService($user))->resetStats();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function ban(User $user): RedirectResponse {
        $user->delete();
        return back()->with("banned");
    }

    public function unban(User $user): RedirectResponse {
        $user->restore();
        return back()->with("unbanned");
    }

    /**
     * Show the user's profile.
     */
    public function show(User $user): Response|RedirectResponse
    {
        return $user->id === auth()->user()?->id
            ? to_route('profile.me')
            : Inertia::render('Profile/Show', [
                'user' => $user->load(['missions', 'posts']),
                'can_ban' => auth()->user()?->can('delete', $user)
            ]);
    }
}
