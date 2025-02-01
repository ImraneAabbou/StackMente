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
            ],
            'notifications' => Inertia::lazy(fn() => $this->getAuthUserNotifications($request)),
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

        $userDetails = [
            'hasPassword' => !!$user?->password,
            'stats' => [
                'xp' => [
                    'curr_level_total' => StatsService::calcToNextLevelTotalXPByLevel($user->stats['level'] - 1),
                    'next_level_total' => StatsService::calcToNextLevelTotalXPByLevel($user->stats['level'])
                ],
                'rank' => [
                    'total' => $userService->getRank('total'),
                    'daily' => $userService->getRank('daily'),
                    'weekly' => $userService->getRank('weekly'),
                    'monthly' => $userService->getRank('monthly'),
                    'yearly' => $userService->getRank('yearly'),
                ]
            ]
        ];

        return array_merge_recursive($user->load(['missions', 'posts'])->toArray(), $userDetails);
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

        $notifications = $user->notifications;

        $postIds = $notifications->pluck('data.post_id')->filter()->unique();
        $commentIds = $notifications->pluck('data.comment_id')->filter()->unique();
        $replyIds = $notifications->pluck('data.reply_id')->filter()->unique();
        $userIds = $notifications->pluck('data.user_id')->filter()->unique();
        $missionIds = $notifications->pluck('data.mission_id')->filter()->unique();

        $posts = Post::whereIn('id', $postIds)->select(['id', 'slug', 'title', 'type'])->get()->keyBy('id');
        $comments = Comment::whereIn('id', $commentIds)
            ->select(['id', 'content'])
            ->get()
            ->keyBy('id')
            ->map(fn($comment) => $comment->setAttribute('content', Str::limit($comment->content, 100)));
        $replies = Reply::whereIn('id', $replyIds)
            ->select(['id', 'content'])
            ->get()
            ->keyBy('id')
            ->map(fn($reply) => $reply->setAttribute('content', Str::limit($reply->content, 100)));
        $users = User::whereIn('id', $userIds)->select(['id', 'fullname', 'username', 'avatar'])->get()->keyBy('id');
        $missions = Mission::whereIn('id', $missionIds)->select(['id', 'title', 'xp_reward', 'image'])->get()->keyBy('id');

        return $notifications->map(fn($n) => array_filter([
            'id' => $n->id,
            'created_at' => $n->created_at,
            'read_at' => $n->read_at,
            'type' => $n->type,
            'post' => isset($n->data['post_id']) && $n->data['post_id']
                ? $posts->get($n->data['post_id'])
                : null,
            'comment' => isset($n->data['comment_id']) && $n->data['comment_id']
                ? $comments->get($n->data['comment_id'])
                : null,
            'reply' => isset($n->data['reply_id']) && $n->data['reply_id']
                ? $replies->get($n->data['reply_id'])
                : null,
            'user' => isset($n->data['user_id']) && $n->data['user_id']
                ? $users->get($n->data['user_id'])
                : null,
            'mission' => isset($n->data['mission_id']) && $n->data['mission_id']
                ? $missions->get($n->data['mission_id'])
                : null
        ]))->toArray();

    }
}
