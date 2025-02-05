<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(): Response
    {
        $querySearch = request()->query('q');
        $tagsQuery = Tag::query();

        if ($querySearch)
            $tagsQuery->whereLike(
                'name',
                '%' . $querySearch . '%'
            );

        $tagsPagination = $tagsQuery
            ->withCount(['posts', 'articles', 'subjects', 'questions'])
            ->orderBy('posts_count', 'desc')
            ->cursorPaginate(25);

        $items = $tagsPagination->items();
        $nextLinkUrl = $tagsPagination->nextPageUrl();

        return Inertia::render('Tags/Index', [
            'tags' => [
                'items' => Inertia::merge($items),
                'count' => $querySearch ? $tagsQuery->count() : Tag::count(),
                'next_link_url' => $nextLinkUrl
            ]
        ]);
    }
}
