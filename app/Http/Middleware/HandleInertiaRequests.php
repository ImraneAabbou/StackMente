<?php

namespace App\Http\Middleware;

use App\Models\Comment;
use App\Models\Mission;
use App\Models\Post;
use App\Models\Reply;
use App\Models\User;
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
                'user' => !($u = $request->user())
                    ? null
                    : [
                        ...$u->toArray(),
                        'notifications' => $u
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
                            )),
                    ],
            ],
            'status' => Inertia::always(fn() => $request->session()->get('status')),
        ];
    }
}
