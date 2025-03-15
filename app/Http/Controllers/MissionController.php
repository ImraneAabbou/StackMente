<?php

namespace App\Http\Controllers;

use App\Enums\Path;
use App\Http\Requests\Mission\StoreMissionRequest;
use App\Http\Requests\Mission\UpdateMissionRequest;
use App\Models\Mission;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use File;

class MissionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Missions/Index', ['missions' => Mission::all()]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Missions/Create');
    }

    public function store(StoreMissionRequest $request): RedirectResponse
    {
        $image = basename($request->file('image')->store('missions', 'images'));
        $data = [
            ...$request->validated(),
            'image' => $image,
        ];

        Mission::create($data);

        return to_route('missions.index');
    }

    public function edit(Mission $mission): Response
    {
        return Inertia::render('Admin/Missions/Edit', ['mission' => $mission]);
    }

    public function update(UpdateMissionRequest $request, Mission $mission): RedirectResponse
    {
        $validated = $request->validated();
        $validated['image'] =
            array_key_exists('image', $validated) && !is_null($validated['image'])
                ? basename($validated['image']->store('missions', 'images'))
                : null;

        $validated = array_filter($validated);

        array_key_exists('image', $validated) && File::delete(public_path(Path::MISSION_IMAGES->value . $mission->image));

        $mission->update($validated);

        return to_route('missions.index');
    }

    public function destroy(Mission $mission): RedirectResponse
    {
        $mission->delete();

        return redirect()->back();
    }
}
