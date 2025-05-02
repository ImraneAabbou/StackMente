<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use ZipArchive;
use Ifsnop\Mysqldump as IMysqldump;

class RestoreDatabase extends Command
{
    protected $signature = 'db:restore {file}';
    protected $description = 'Restore the database and public folder from a zip backup';

    public function handle(): int
    {
        $zipPath = $this->argument('file');

        if (!file_exists($zipPath)) {
            $this->error("Backup zip file does not exist: $zipPath");
            return 1;
        }

        $extractPath = '/tmp/stackmente/restore/' . now()->timestamp;
        if (!mkdir($extractPath, 0777, true) && !is_dir($extractPath)) {
            $this->error("Failed to create temp directory: $extractPath");
            return 1;
        }

        $zip = new ZipArchive();
        if ($zip->open($zipPath) !== true) {
            $this->error("Failed to open zip file: $zipPath");
            return 1;
        }

        $zip->extractTo($extractPath);
        $zip->close();

        $extractedDumpPath = $extractPath . '/dump.sql';
        $extractedPublicDirPath = $extractPath . '/public';

        if (!file_exists($extractedDumpPath) || !is_dir($extractedPublicDirPath)) {
            $this->error("The zip file must contain both 'dump.sql' and a 'public' folder.");
            File::deleteDirectory($extractPath);
            return 1;
        }

        $dbName = env('DB_DATABASE');
        $user = env('DB_USERNAME');
        $pass = env('DB_PASSWORD');
        $host = env('DB_HOST', '127.0.0.1');
        $port = env('DB_PORT', 3306);

        try {
            $db = new IMysqldump\Mysqldump(
                "mysql:host={$host};port={$port};dbname={$dbName}",
                $user,
                $pass
            );

            $db->restore($extractedDumpPath);
            $this->info("Database restored.");
        } catch (\Throwable $e) {
            $this->error("Database restore failed: " . $e->getMessage());
            File::deleteDirectory($extractPath);
            return 1;
        }

        File::cleanDirectory(public_path());
        File::copyDirectory($extractedPublicDirPath, public_path());

        File::deleteDirectory($extractPath);

        $this->info('Public folder restored successfully.');
        $this->info('Restoration complete.');
        return 0;
    }
}

