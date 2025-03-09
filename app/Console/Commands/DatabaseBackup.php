<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class DatabaseBackup extends Command
{
    protected $signature = 'db:backup';
    protected $backupFolderPath = 'private/backups';
    protected $description = 'Backup the database and store it in storage/app/backups';

    /**
     * @return int
     */
    public function handle(): int
    {
        $dbName = env('DB_DATABASE');
        $user = env('DB_USERNAME');
        $pass = env('DB_PASSWORD');

        $fileName = now()->format('Y-m-d_H-i-s') . '-backup.sql';
        $backupPath = storage_path("app/{$this->backupFolderPath}/{$fileName}");

        Storage::makeDirectory('backups');

        $command = "mysqldump -u {$user} -p'{$pass}' {$dbName} > {$backupPath}";
        exec($command, $output, $returnVar);

        if ($returnVar === 0) {
            $this->info("Backup created: {$fileName}");
            return 0;
        } else {
            $this->error('Backup failed.');
            return 1;
        }
    }
}
