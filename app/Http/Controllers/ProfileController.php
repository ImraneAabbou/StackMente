<?php

namespace App\Http\Controllers;

use App\Events\UserBanned;
use App\Http\Requests\Auth\RegisterationRequest;
use App\Http\Requests\Profile\DeleteAccountRequest;
use App\Http\Requests\Profile\ProfileUpdateRequest;
use App\Models\User;
use App\Services\StatsService;
use App\Services\UserService;
use App\Traits\ReportableCtrl;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            array_key_exists('avatar', $validated) && !is_null($validated['avatar'])
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

        return back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(DeleteAccountRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->username = 'deleted-' . Str::uuid();
        $user->fullname = $user->username;
        $user->email = $user->username . '@stackmente.com';
        $user->password = null;
        $user->email_verified_at = null;
        $user->avatar = '';
        $user->providers = [];

        $statsService = new StatsService($user);
        $statsService->resetStats();
        $statsService->resetStats();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function delete(Request $request, User $user)
    {
        $user->username = 'deleted-' . Str::uuid();
        $user->fullname = $user->username;
        $user->email = $user->username . '@stackmente.com';
        $user->password = null;
        $user->email_verified_at = null;
        $user->avatar = '';
        $user->providers = [];

        $statsService = new StatsService($user);
        $statsService->resetStats();
        $statsService->resetStats();

        $request->force
            ? $user->forceDelete()
            : $user->delete();

        return back();
    }

    public function ban(User $user): RedirectResponse
    {
        event(new UserBanned($user));
        $user->delete();
        return back();
    }

    public function unban(User $user): RedirectResponse
    {
        $user->restore();
        return back()->with('unbanned');
    }

    /**
     * Show the user's profile.
     */
    public function show(User $user): Response|RedirectResponse
    {
        $statsSrv = new StatsService($user);
        $userDetails = $statsSrv->getUserStats();
        return $user->id === auth()->user()?->id
            ? to_route('profile.index')
            : Inertia::render('Profile/Show', [
                'user' => array_merge_recursive(
                    $user
                        ->loadCount(['answers'])
                        ->load(
                            [
                                'missions',
                                'posts' => fn($q) => $q
                                    ->with(['tags'])
                                    ->withCount(['upVotes', 'downVotes', 'comments'])
                            ]
                        )
                        ->toArray(),
                    [
                        ...$userDetails,
                        'can_ban' => auth()->user()?->can('delete', $user)
                    ]
                ),
            ]);
    }
}
