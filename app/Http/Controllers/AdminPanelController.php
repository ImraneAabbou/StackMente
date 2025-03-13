<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\User;
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
        // Get RAM details
        $ramTotal = shell_exec("free -m | grep Mem | awk '{print \$2}'");  // Total RAM in MB
        $ramUsage = shell_exec("free -m | grep Mem | awk '{print \$3}'");  // Used RAM in MB
        $ramUsagePercent = round($ramUsage / $ramTotal, 2) * 100;  // Used RAM in MB
        $ramFreePercent = 100 - $ramUsagePercent;  // Used RAM in MB

        // Convert RAM values to human-readable format
        $ramTotalFormatted = $this->humanReadableSize($ramTotal * 1024 * 1024);  // Convert MB to bytes
        $ramUsageFormatted = $this->humanReadableSize($ramUsage * 1024 * 1024);  // Convert MB to bytes

        // Get disk usage details
        $diskTotal = disk_total_space('/');
        $diskFree = disk_free_space('/');
        $diskUsage = $diskTotal - $diskFree;
        $diskUsagePercent = round($diskUsage / $diskTotal, 2) * 100;
        $diskFreePercent = 100 - $diskUsagePercent;

        // Convert disk values to human-readable format
        $diskFreeFormatted = $this->humanReadableSize($diskFree);
        $diskTotalFormatted = $this->humanReadableSize($diskTotal);
        $diskUsageFormatted = $this->humanReadableSize($diskUsage);

        return [
            'ram_total' => $ramTotalFormatted,
            'ram_free_percent' => $ramFreePercent,
            'ram_usage' => $ramUsageFormatted,
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

        /* $x = new Info(); */

        return Inertia::render('Admin/Index', [
            'analysis' => [
                'users' => compact('total_users', 'total_admins', 'total_banned_users', 'registrations'),
                'system_usage' => $this->getSystemUsage()
            ],
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
