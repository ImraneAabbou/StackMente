<?php

namespace App\Http\Controllers;

use App\Enums\ReportableType;
use App\Enums\Role;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Reply;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPanelController extends Controller
{
    /**
     * @param int $bytes
     * @param int $decimals
     */
    private function humanReadableSize(int $bytes, $decimals = 2): string
    {
        $sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . ' ' . $sizes[$factor];
    }

    /**
     * @return array<string,mixed>
     */
    private function getSystemUsage(): array
    {
        $ramTotal = shell_exec("free -m | grep Mem | awk '{print \$2}'");
        $ramUsage = shell_exec("free -m | grep Mem | awk '{print \$3}'");
        $ramFree = $ramTotal - $ramUsage;
        $ramUsagePercent = round($ramUsage / $ramTotal, 2) * 100;
        $ramFreePercent = 100 - $ramUsagePercent;

        $ramTotalFormatted = $this->humanReadableSize($ramTotal * 1024 * 1024);
        $ramUsageFormatted = $this->humanReadableSize($ramUsage * 1024 * 1024);
        $ramFreeFormatted = $this->humanReadableSize($ramFree * 1024 * 1024);

        $diskTotal = disk_total_space('/');
        $diskFree = disk_free_space('/');
        $diskUsage = $diskTotal - $diskFree;
        $diskUsagePercent = round($diskUsage / $diskTotal, 2) * 100;
        $diskFreePercent = 100 - $diskUsagePercent;

        $diskFreeFormatted = $this->humanReadableSize($diskFree);
        $diskTotalFormatted = $this->humanReadableSize($diskTotal);
        $diskUsageFormatted = $this->humanReadableSize($diskUsage);

        return [
            'ram_total' => $ramTotalFormatted,
            'ram_free_percent' => $ramFreePercent,
            'ram_usage' => $ramUsageFormatted,
            'ram_free' => $ramFreeFormatted,
            'ram_usage_percent' => $ramUsagePercent,
            'disk_total' => $diskTotalFormatted,
            'disk_free' => $diskFreeFormatted,
            'disk_free_percent' => $diskFreePercent,
            'disk_usage' => $diskUsageFormatted,
            'disk_usage_percent' => $diskUsagePercent,
        ];
    }

    public function dashboard(): Response
    {
        $total_users = User::count();
        $total_admins = User::where('role', Role::ADMIN)->count();
        $total_banned_users = User::onlyTrashed()->count();

        $registrations = [
            'MONTHLY' => User::query()
                ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as label, COUNT(id) as count")
                ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
                ->orderBy('label', 'DESC')
                ->limit(12)
                ->get()
                ->pluck('count', 'label')
                ->reverse(),
            'YEARLY' => User::query()
                ->selectRaw('YEAR(created_at) as label, COUNT(id) as count')
                ->groupByRaw('YEAR(created_at)')
                ->orderBy('label', 'ASC')
                ->limit(12)
                ->get()
                ->pluck('count', 'label'),
        ];

        $total_posts = Post::count();
        $total_questions = Post::questions()->count();
        $total_subjects = Post::subjects()->count();
        $total_articles = Post::articles()->count();

        $publications = [
            'ARTICLE' => [
                'MONTHLY' => Post::articles()
                    ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as label, COUNT(id) as count")
                    ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
                    ->orderBy('label', 'DESC')
                    ->limit(12)
                    ->get()
                    ->pluck('count', 'label')
                    ->reverse(),
                'YEARLY' => Post::articles()
                    ->selectRaw('YEAR(created_at) as label, COUNT(id) as count')
                    ->groupByRaw('YEAR(created_at)')
                    ->orderBy('label', 'ASC')
                    ->limit(12)
                    ->get()
                    ->pluck('count', 'label'),
            ],
            'QUESTION' => [
                'MONTHLY' => Post::questions()
                    ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as label, COUNT(id) as count")
                    ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
                    ->orderBy('label', 'DESC')
                    ->limit(12)
                    ->get()
                    ->pluck('count', 'label')
                    ->reverse(),
                'YEARLY' => Post::questions()
                    ->selectRaw('YEAR(created_at) as label, COUNT(id) as count')
                    ->groupByRaw('YEAR(created_at)')
                    ->orderBy('label', 'ASC')
                    ->limit(12)
                    ->get()
                    ->pluck('count', 'label'),
            ],
            'SUBJECT' => [
                'MONTHLY' => Post::subjects()
                    ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as label, COUNT(id) as count")
                    ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
                    ->orderBy('label', 'DESC')
                    ->limit(12)
                    ->get()
                    ->pluck('count', 'label')
                    ->reverse(),
                'YEARLY' => Post::questions()
                    ->selectRaw('YEAR(created_at) as label, COUNT(id) as count')
                    ->groupByRaw('YEAR(created_at)')
                    ->orderBy('label', 'ASC')
                    ->limit(12)
                    ->get()
                    ->pluck('count', 'label'),
            ],
        ];

        return Inertia::render('Admin/Index', [
            'analysis' => [
                'users' => compact('total_users', 'total_admins', 'total_banned_users', 'registrations'),
                'posts' => compact('total_posts', 'total_articles', 'total_subjects', 'total_questions', 'publications'),
                'system_usage' => $this->getSystemUsage()
            ],
        ]);
    }

    public function bans(Request $request): Response
    {
        $q = $request->query('q');
        $bannedUsersPagination = User::onlyBanned()
            ->when(
                !is_null($q),
                fn($dbQuery) => $dbQuery
                    ->where(
                        fn($c) => $c
                            ->whereLike('fullname', "%$q%")
                            ->orWhereLike('username', "%$q%")
                            ->orWhereLike('email', "%$q%")
                    )
            )
            ->cursorPaginate(25);

        return Inertia::render('Admin/Bans/Index', [
            'banned_users' => [
                'items' => $bannedUsersPagination->items(),
                'next_page_url' => $bannedUsersPagination->nextPageUrl()
            ]
        ]);
    }

    // Reports
    public function reportsUsers(Request $request): Response
    {
        $q = $request->query('q');
        $reportsPagination = Report::select('reports.*')
            ->selectSub(function ($query) {
                $query
                    ->selectRaw('COUNT(*)')
                    ->from('reports as r')
                    ->whereColumn('r.reportable_id', 'reports.reportable_id')
                    ->where('r.reportable_type', ReportableType::USER);
            }, 'reports_count')
            ->whereIn('id', function ($query) {
                $query
                    ->selectRaw('MAX(id)')
                    ->from('reports')
                    ->where('reportable_type', ReportableType::USER)
                    ->groupBy('reportable_id');
            })
            ->when($q, fn($query) => $query
                ->whereHasMorph('reportable', [User::class], function ($c) use ($q) {
                    $c->withTrashed()->where(function ($c) use ($q) {
                        $c
                            ->where('fullname', 'like', "%$q%")
                            ->orWhere('username', 'like', "%$q%")
                            ->orWhere('email', 'like', "%$q%");
                    });
                }))
            ->with(['reportable', 'user'])
            ->cursorPaginate(25)
            ->withQueryString();

        return Inertia::render(
            'Admin/Reports/Users',
            [
                'reports' => [
                    'items' => $reportsPagination->items(),
                    'next_page_url' => $reportsPagination->nextPageUrl(),
                ],
            ]
        );
    }

    public function reportMessages($reportable)
    {
        $reportsWithMessagesPagination = $reportable->reports()->with(['user'])->cursorPaginate(1);
        return Inertia::render('Admin/Reports/Messages', [
            'reportableWithMessages' => [
                'items' => $reportsWithMessagesPagination->items(),
                'next_page_url' => $reportsWithMessagesPagination->nextPageUrl(),
            ],
        ]);
    }

    public function reportsComments(Request $request): Response
    {
        $q = $request->query('q');
        $reportsPagination = Report::select('reports.*')
            ->selectSub(function ($query) {
                $query
                    ->selectRaw('COUNT(*)')
                    ->from('reports as r')
                    ->whereColumn('r.reportable_id', 'reports.reportable_id')
                    ->where('r.reportable_type', ReportableType::COMMENT);
            }, 'reports_count')
            ->whereIn('id', function ($query) {
                $query
                    ->selectRaw('MAX(id)')
                    ->from('reports')
                    ->where('reportable_type', ReportableType::COMMENT)
                    ->groupBy('reportable_id');
            })
            ->when($q, function ($query) use ($q) {
                $query
                    ->whereHasMorph('reportable', [Comment::class], function ($c) use ($q) {
                        $c->where(function ($c) use ($q) {
                            $c
                                ->where('content', 'like', "%$q%")
                                ->orWhereHas('user', function ($userQuery) use ($q) {
                                    $userQuery
                                        ->whereLike('fullname', "%$q%")
                                        ->orWhereLike('username', "%$q%")
                                        ->orWhereLike('email', "%$q%");
                                });
                        });
                    });
            })
            ->with(['reportable:id,user_id,post_id', 'reportable.user', 'reportable.post:id,type,slug'])
            ->cursorPaginate(25)
            ->withQueryString();

        return Inertia::render(
            'Admin/Reports/Comments',
            [
                'reports' => [
                    'items' => $reportsPagination->items(),
                    'next_page_url' => $reportsPagination->nextPageUrl(),
                ],
            ]
        );
    }

    public function reportsReplies(Request $request): Response
    {
        $q = $request->query('q');
        $reportsPagination = Report::select('reports.*')
            ->selectSub(function ($query) {
                $query
                    ->selectRaw('COUNT(*)')
                    ->from('reports as r')
                    ->whereColumn('r.reportable_id', 'reports.reportable_id')
                    ->where('r.reportable_type', ReportableType::REPLY);
            }, 'reports_count')
            ->whereIn('id', function ($query) {
                $query
                    ->selectRaw('MAX(id)')
                    ->from('reports')
                    ->where('reportable_type', ReportableType::REPLY)
                    ->groupBy('reportable_id');
            })
            ->when($q, function ($query) use ($q) {
                $query
                    ->whereHasMorph('reportable', [Reply::class], function ($c) use ($q) {
                        $c->where(function ($c) use ($q) {
                            $c
                                ->where('content', 'like', "%$q%")
                                ->orWhereHas('user', function ($userQuery) use ($q) {
                                    $userQuery
                                        ->whereLike('fullname', "%$q%")
                                        ->orWhereLike('username', "%$q%")
                                        ->orWhereLike('email', "%$q%");
                                });
                        });
                    });
            })
            ->with(['reportable:id,user_id,comment_id', 'reportable.user', 'reportable.comment.post:id,type,slug'])
            ->cursorPaginate(25)
            ->withQueryString();

        return Inertia::render(
            'Admin/Reports/Replies',
            [
                'reports' => [
                    'items' => $reportsPagination->items(),
                    'next_page_url' => $reportsPagination->nextPageUrl(),
                ],
            ]
        );
    }

    public function reportsPosts(Request $request): Response
    {
        $q = $request->query('q');
        $reportsPagination = Report::select('reports.*')
            ->selectSub(function ($query) {
                $query
                    ->selectRaw('COUNT(*)')
                    ->from('reports as r')
                    ->whereColumn('r.reportable_id', 'reports.reportable_id')
                    ->where('r.reportable_type', ReportableType::POST);
            }, 'reports_count')
            ->whereIn('id', function ($query) {
                $query
                    ->selectRaw('MAX(id)')
                    ->from('reports')
                    ->where('reportable_type', ReportableType::POST)
                    ->groupBy('reportable_id');
            })
            ->when($q, fn($query) => $query
                ->whereHasMorph('reportable', [Post::class], function ($c) use ($q) {
                    $c->where(function ($c) use ($q) {
                        $c
                            ->where('title', 'like', "%$q%");
                    });
                }))
            ->with(['reportable'])
            ->cursorPaginate(25)
            ->withQueryString();

        return Inertia::render(
            'Admin/Reports/Posts',
            [
                'reports' => [
                    'items' => $reportsPagination->items(),
                    'next_page_url' => $reportsPagination->nextPageUrl(),
                ],
            ]
        );
    }
}
