<?php

namespace App\Console\Commands;

use App\Enums\Period;
use App\Events\SeasonEnded;
use App\Models\User;
use Illuminate\Console\Command;
use Str;

class ResetSeason extends Command
{
    protected $signature = 'season:reset {type?}';
    protected $description = 'Reset XP seasons based on type (daily, weekly, monthly, yearly)';

    public function handle(): void
    {
        $type = $this->argument('type');
        $validTypes = ['daily', 'weekly', 'monthly', 'yearly'];

        if ($type && !in_array($type, $validTypes)) {
            $this->error('Invalid type. Use one of: ' . implode(', ', $validTypes));
            return;
        }

        event(new SeasonEnded(Period::from(Str::upper($type))));

        User::all()->each(function ($user) use ($type) {
            $stats = $user->stats;
            if (!$type || $type === 'daily') {
                $stats['xp']['daily'] = 0;
            }
            if (!$type || $type === 'weekly') {
                $stats['xp']['weekly'] = 0;
            }
            if (!$type || $type === 'monthly') {
                $stats['xp']['monthly'] = 0;
            }
            if (!$type || $type === 'yearly') {
                $stats['xp']['yearly'] = 0;
            }

            $user->stats = $stats;
            $user->save();
        });

        $this->info('XP reset successfully.');
    }
}
