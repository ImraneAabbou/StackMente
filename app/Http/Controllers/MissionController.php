<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use Inertia\Inertia;
use Inertia\Response;

class MissionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Missions/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Missions/Create');
    }

    public function edit(Mission $mission): Response
    {
        return Inertia::render('Admin/Missions/Edit');
    }
}
