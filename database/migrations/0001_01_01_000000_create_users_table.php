<?php

use App\Enums\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('avatar')->nullable();
            $table->string('fullname');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table
                ->json('stats')
                ->default(
                    json_encode([
                        'xp' => [
                            'total' => 0,
                            'daily' => 0,
                            'weekly' => 0,
                            'monthly' => 0,
                            'yearly' => 0,
                        ],
                        'login' => [
                            'streak' => 0,
                            'max_streak' => 0,
                            'streak_started_at' => now(),
                        ],
                        'level' => 1,
                        'timespent' => 0,
                        'last_interaction' => now(),
                    ])
                );
            $table->json('providers')->default('{}');
            $table->enum('role', array_column(Role::cases(), 'value'))->default(Role::USER->value);
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
