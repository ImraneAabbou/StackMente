<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class RestoreDatabase extends Command
{
    protected $signature = 'db:restore {file}';
    protected $description = 'Restore the database from an SQL file';

    public function handle(): int
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("The file does not exist: $filePath");
            return 1;
        }

        $dbHost = env('DB_HOST');
        $dbPort = env('DB_PORT');
        $dbName = env('DB_DATABASE');
        $dbUser = env('DB_USERNAME');
        $dbPass = env('DB_PASSWORD');

        $command = sprintf(
            'mysql --host=%s --port=%s --user=%s --password=%s %s < %s',
            escapeshellarg($dbHost),
            escapeshellarg($dbPort),
            escapeshellarg($dbUser),
            escapeshellarg($dbPass),
            escapeshellarg($dbName),
            escapeshellarg($filePath)
        );

        $process = Process::fromShellCommandline($command);
        $process->setTimeout(0);

        try {
            $process->mustRun();
            $this->info('Database restored successfully.');
        } catch (ProcessFailedException $exception) {
            $this->error('Error restoring database: ' . $exception->getMessage());
        }

        return 0;
    }
}
