<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminPanelController extends Controller
{
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
                ->pluck('count', 'label')->reverse(),
            'YEARLY' => User::query()
                ->selectRaw('YEAR(created_at) as label, COUNT(id) as count')
                ->groupByRaw('YEAR(created_at)')
                ->orderBy('label', 'ASC')
                ->limit(12)
                ->get()
                ->pluck('count', 'label'),
        ];

        return Inertia::render('Admin/Index', [
            'analysis' => [
                'users' => compact('total_users', 'total_admins', 'total_banned_users', 'registrations'),
                'posts' => [],
                'reports' => [],
            ]
        ]);
    }

    public function bans(): Response
    {
        return Inertia::render('Admin/Bans');
    }

    // Reports
    public function reportsUsers(): Response
    {
        return Inertia::render('Admin/Reports/Users');
    }

    public function reportsComments(): Response
    {
        return Inertia::render('Admin/Reports/Comments');
    }

    public function reportsReplies(): Response
    {
        return Inertia::render('Admin/Reports/Replies');
    }

    public function reportsQuestions(): Response
    {
        return Inertia::render('Admin/Reports/Questions');
    }

    public function reportsSubjects(): Response
    {
        return Inertia::render('Admin/Reports/Subjects');
    }

    public function reportsArticles(): Response
    {
        return Inertia::render('Admin/Reports/Articles');
    }
}
