<?php

namespace App\Http\Middleware;

use App\Models\Comment;
use App\Models\Mission;
use App\Models\Post;
use App\Models\Reply;
use App\Models\Tag;
use App\Models\User;
use App\Services\StatsService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
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
                'user' => fn() => $this->getAuthUser($request),
            ],
            'notifications' => fn() => $this->getAuthUserNotifications($request),
            'status' => Inertia::always(fn() => $request->session()->get('status')),
            'results' => fn() => $this->getSearchResults($request),
            'tags_completions' => fn() => $this->getTagsCompletions($request)
        ];
    }

    public function getTagsCompletions(Request $request): Collection|array
    {
        $q = $request->query('tags_completions_query');

        return $q
            ? Tag::whereLike('name', "%$q%")
                ->orWhereLike('description', "%$q%")
                ->limit(10)
                ->get()
            : [];
    }

    /**
     * Returns the results of the given search query
     * Returns null if not provided
     */
    public function getSearchResults(Request $request): ?array
    {
        $q = $request->query('q');

        if (is_null($q))
            return $q;

        $articlesQuery = Post::articles()->inRandomOrder()->getQuery();
        $subjectsQuery = Post::subjects()->inRandomOrder()->getQuery();
        $questionsQuery = Post::questions()->inRandomOrder()->getQuery();
        $tagsQuery = Tag::query();
        $usersQuery = User::query();

        $articlesQuery->whereLike('title', "%$q%");
        $subjectsQuery->whereLike('title', "%$q%");
        $questionsQuery->whereLike('title', "%$q%");
        $tagsQuery->whereLike('name', "%$q%");
        $usersQuery->whereLike('fullname', "%$q%")->orWhereLike('username', "%$q%");

        return [
            'q' => $q,
            'articles' => [
                'items' => $articlesQuery
                    ->limit(5)
                    ->get()
                    ->map(fn($p) => [
                        ...((array) $p),
                        'content' => Str::limit($p->content, 100),
                    ]),
                'count' => $articlesQuery->count(),
            ],
            'subjects' => [
                'items' => $subjectsQuery
                    ->limit(5)
                    ->get()
                    ->map(fn($p) => [
                        ...((array) $p),
                        'content' => Str::limit($p->content, 100),
                    ]),
                'count' => $subjectsQuery->count(),
            ],
            'questions' => [
                'items' => $questionsQuery
                    ->limit(5)
                    ->get()
                    ->map(fn($p) => [
                        ...((array) $p),
                        'content' => Str::limit($p->content, 100),
                    ]),
                'count' => $questionsQuery->count(),
            ],
            'tags' => [
                'items' => $tagsQuery->limit(5)->get(),
                'count' => $tagsQuery->count(),
            ],
            'users' => [
                'items' => $usersQuery->limit(10)->get(),
                'count' => $usersQuery->count(),
            ],
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

        $statsSrv = new StatsService($user);
        $userDetails = [
            ...$statsSrv->getUserStats($user),
            'hasPassword' => !!$user->password
        ];

        return array_merge_recursive(
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
            $userDetails
        );
    }

    /**
     * Returns the authenticated user's notifications
     * Returns null if guest
     */
    public function getAuthUserNotifications(Request $request): ?array
    {
        $user = $request->user();

        if (!$user)
            return [
                'items' => [],
                'next_page_url' => null
            ];

        $notifications = collect();

        for ($i = 1; $i <= ($request->query('notifications_page') ?? 1); $i++) {
            $notificationsPaginate = $user->notifications()->simplePaginate(10, ['*'], 'notifications_page', $i);
            $notifications = $notifications->merge($notificationsPaginate->items());
        }

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
        $missions = Mission::whereIn('id', $missionIds)->get()->keyBy('id');

        return [
            'items' => $notifications->map(fn($n) => array_filter([
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
            ]))->toArray(),
            'next_page_url' => $notificationsPaginate->nextPageUrl()
        ];
    }
}
