<?php

namespace App\Console\Commands;

use Ifsnop\Mysqldump as IMysqldump;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use ZipArchive;

class DatabaseBackup extends Command
{
    protected $signature = 'db:backup';
    protected $description = 'Backup the database and public folder into a zip file';
    protected string $backupFolderPath;

    public function __construct()
    {
        parent::__construct();
        $this->backupFolderPath = storage_path('app/private/backups');
    }

    public function handle(): int
    {
        $dbName = env('DB_DATABASE');
        $user = env('DB_USERNAME');
        $pass = env('DB_PASSWORD');
        $host = env('DB_HOST', '127.0.0.1');
        $port = env('DB_PORT', 3306);

        $timestamp = now()->format('Y-m-d_H:i:s');
        $zipFileName = "{$timestamp}.zip";
        $zipFullPath = "{$this->backupFolderPath}/{$zipFileName}";

        $tempDir = "/tmp/stackmente/backup/{$timestamp}";
        $sqlPath = "{$tempDir}/dump.sql";

        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        try {
            $dump = new IMysqldump\Mysqldump(
                "mysql:host={$host};port={$port};dbname={$dbName}",
                $user,
                $pass,
                [
                    'insert-ignore' => true,
                    'add-drop-trigger' => false,
                    'if-not-exists' => true,
                ]
            );
            $dump->start($sqlPath);
        } catch (\Exception $e) {
            $this->error('DB Dump failed: ' . $e->getMessage());
            return 1;
        }

        $zip = new ZipArchive();
        if ($zip->open($zipFullPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            $this->error('Failed to create zip archive.');
            return 1;
        }

        $zip->addFile($sqlPath, 'dump.sql');

        $this->addFolderToZip(public_path(), $zip, 'public');

        $zip->close();

        unlink($sqlPath);
        rmdir($tempDir);

        $this->info("Backup created: {$this->backupFolderPath}/{$zipFileName}");
        return 0;
    }

    /**
     * @param mixed $folderPath
     * @param mixed $zipSubfolder
     */
    protected function addFolderToZip($folderPath, ZipArchive $zip, $zipSubfolder = ''): void
    {
        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($folderPath, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($files as $file) {
            $relativePath = $zipSubfolder . '/' . ltrim(Str::replaceFirst($folderPath, '', $file), '/\\');

            if ($file->isDir()) {
                $zip->addEmptyDir($relativePath);
            } else {
                $zip->addFile($file, $relativePath);
            }
        }
    }
}
