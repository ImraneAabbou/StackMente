<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use ZipArchive;

class BackupController extends Controller
{
    protected $backupFolderPath = 'backups/';

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
     * Show all backups with name, date, and size.
     */
    public function index(): Response
    {
        $files = Storage::files($this->backupFolderPath);

        $backups = collect($files)->map(function ($file) {
            return [
                'name' => basename($file),
                'size' => $this->humanReadableSize(Storage::size($file)),
            ];
        })->sortByDesc('created_at')->values();

        return inertia('Admin/Backup/Index', compact('backups'));
    }

    /**
     * Store a new backup.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'backup' => ['nullable', 'file', 'mimes:zip'],
        ]);

        $backup_file = $request->file('backup');

        if ($backup_file) {
            $zip = new ZipArchive;
            if ($zip->open($backup_file->getPathname()) === true) {
                $hasPublic = false;
                $hasDump = false;

                for ($i = 0; $i < $zip->numFiles; $i++) {
                    $entry = $zip->getNameIndex($i);

                    if (str_starts_with($entry, 'public/')) {
                        $hasPublic = true;
                    }

                    if (basename($entry) === 'dump.sql') {
                        $hasDump = true;
                    }

                    if ($hasPublic && $hasDump) {
                        break;
                    }
                }

                $zip->close();

                if (!($hasPublic && $hasDump)) {
                    return back()->withErrors([
                        'backup' => __('validation.backup_backup_not_valid'),
                    ]);
                }
            } else {
                return back()->withErrors([
                    'backup' => __('validation.backup_corrupted'),
                ]);
            }

            $backup_file->storeAs(
                $this->backupFolderPath,
                now()->format('Y-m-d_H-i-s') . '-backup.zip'
            );

            return back()->with('status', __('status.backup-upload-success'));
        }

        Storage::makeDirectory($this->backupFolderPath);

        $exitCode = Artisan::call('db:backup');

        if ($exitCode === 0) {
            return back()->with('status', __('status.backup-creation-success'));
        } else {
            return back()->withErrors(['backup' => __('status.backup-creation-failed')]);
        }
    }

    public function show(string $backup): StreamedResponse
    {
        try {
            return Storage::download($this->backupFolderPath . $backup);
        } catch (\Throwable $t) {
            return abort(404);
        }
    }

    /**
     * Delete a backup.
     */
    public function destroy(string $backup): RedirectResponse
    {
        Storage::delete($this->backupFolderPath . $backup);

        return back();
    }

    /**
     * Restore / Rollback to the given backup.
     */
    public function update(string $backup): RedirectResponse
    {
        $filePath = $this->backupFolderPath . $backup;

        if (!Storage::exists($filePath)) {
            return abort(404);
        }

        try {
            $fullPath = storage_path('app/private/' . $filePath);

            Artisan::call('db:restore', [
                'file' => $fullPath,
            ]);

            return back()->with('status', __('status.backup-restoration-success'));
        } catch (\Exception $e) {
            return back()->withErrors(['backup' => __('status.backup-restoration-failed', ['message' => $e->getMessage()])]);
        }
    }
}
