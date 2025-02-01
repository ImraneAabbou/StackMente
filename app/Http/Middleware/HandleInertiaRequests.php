<?php

namespace App\Http\Middleware;

use App\Models\Comment;
use App\Models\Mission;
use App\Models\Post;
use App\Models\Reply;
use App\Models\User;
use App\Services\StatsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;
use Str;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $this->getAuthUser($request),
                'hasPassword' => !!(auth()->user()?->password)
            ],
            'status' => Inertia::always(fn() => $request->session()->get('status')),
        ];
    }

    /**
     * Returns the current user's information
     * Returns null if guest
     */
    public function getAuthUser(Request $request): ?array
    {
        $user = $request->user();

        if (!$user)
            return null;

        $userService = new StatsService($user);

        $user['stats->xp->curr_level_total'] = StatsService::calcToNextLevelTotalXPByLevel($user->stats['level'] - 1);
        $user['stats->xp->next_level_total'] = StatsService::calcToNextLevelTotalXPByLevel($user->stats['level']);
        $user['stats->rank'] = [
            'total' => $userService->getRank('total'),
            'daily' => $userService->getRank('daily'),
            'weekly' => $userService->getRank('weekly'),
            'monthly' => $userService->getRank('monthly'),
            'yearly' => $userService->getRank('yearly'),
        ];

        return [
            ...$user->load(['missions', 'posts'])->toArray(),
            'notifications' => $this->getAuthUserNotifications($request)
        ];
    }

    /**
     * Returns the authenticated user's notifications
     * Returns null if guest
     */
    public function getAuthUserNotifications(Request $request): ?array
    {
        $user = $request->user();

        if (!$user)
            return null;

        return $user
            ->notifications
            ->map(fn($n) => array_filter(
                [
                    'id' => $n->id,
                    'created_at' => $n->created_at,
                    'read_at' => $n->read_at,
                    'type' => $n->type,
                    'post' => $n->data['post_id'] ?? null
                        ? Post::select(['id', 'slug', 'title', 'type'])
                            ->where('id', $n->data['post_id'])
                            ->first()
                        : null,
                    'comment' => $n->data['comment_id'] ?? null
                        ? [
                            ...(
                                $c = Comment::select(['id', 'content'])
                                    ->where('id', $n->data['comment_id'])
                                    ->first()
                            )->toArray(),
                            'content' => Str::limit($c->content)
                        ]
                        : null,
                    'reply' => $n->data['reply_id'] ?? null
                        ? [
                            ...(
                                $r = Reply::select(['id', 'content'])
                                    ->where('id', $n->data['reply_id'])
                                    ->first()
                            )->toArray(),
                            'content' => Str::limit($r->content)
                        ]
                        : null,
                    'user' => $n->data['user_id'] ?? null
                        ? User::select(['id', 'fullname', 'username', 'avatar'])
                            ->where('id', $n->data['user_id'])
                            ->first()
                        : null,
                    'mission' => $n->data['mission_id'] ?? null
                        ? Mission::select(['id', 'title', 'xp_reward', 'image'])
                            ->where('id', $n->data['mission_id'])
                            ->first()
                        : null
                ]
            ))
            ->toArray();
    }
}
