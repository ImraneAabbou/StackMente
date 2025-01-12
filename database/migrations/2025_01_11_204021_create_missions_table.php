<?php

use App\Enums\MissionType;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->id();
            $table->string('image');
            $table->string('title')->unique();
            $table->string('description');
            $table->enum('type', array_column(MissionType::cases(), 'value'));
            $table->integer('threshold');
            $table->timestamps();
        });

        Schema::create('mission_user', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Mission::class)->constrained()->cascadeOnDelete();
            $table->timestamp('accomplished_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mission_user');
        Schema::dropIfExists('missions');
    }
};
