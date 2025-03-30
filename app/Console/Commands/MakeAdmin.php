<?php
namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class MakeAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin
                            {fullname? : The full name of the user}
                            {username? : The username of the user}
                            {email? : The email address of the user}
                            {password? : The password for the user}
                            {--super-admin : Make the user a super admin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an admin / super admin user.';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle(): void
    {
        // Check if --super-admin flag is passed (non-interactive mode)
        $isSuperAdmin = $this->option('super-admin');

        // Set the role based on the flag or default to "admin"
        $role = $isSuperAdmin ? 'SUPER_ADMIN' : 'ADMIN';

        $fullname = $this->argument('fullname') ?? $this->ask('Enter the full name');
        $username = $this->argument('username') ?? $this->ask('Enter the username');
        $email = $this->argument('email') ?? $this->ask('Enter the email address');
        $password = $this->argument('password') ?? $this->secret('Enter the password');

        $passwordConfirmation = $this->secret('Confirm the password');

        if ($password !== $passwordConfirmation) {
            $this->error('Passwords do not match!');
            return;
        }

        if (!$isSuperAdmin) {
            $role = $this->choice("User's Role", ['ADMIN', 'SUPER_ADMIN']);
        }

        User::create([
            'fullname' => $fullname,
            'username' => $username,
            'email' => $email,
            'email_verified_at' => now(),
            'role' => $role,
            'password' => Hash::make($password),
        ]);

        $this->info('User created successfully as ' . $role . '!');
    }
}
