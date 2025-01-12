<?php

namespace Database\Seeders;

use App\Models\Mission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class MissionAttacherSeeder extends Seeder
{
    private function getRandomMissionIds(): Collection
    {
        $missionsCount = Mission::count();

        return Mission::inRandomOrder()
            ->limit(fake()->numberBetween(1, $missionsCount))
            ->pluck('id');
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()
            ->each(function (User $user) {
                $missionIds = $this->getRandomMissionIds();

                $user->missions()->attach(
                    $missionIds
                );
            });
    }
}
