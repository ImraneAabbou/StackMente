<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS delete_deleted_missions_from_notifications');
        DB::unprepared('
            CREATE TRIGGER delete_deleted_missions_from_notifications
            AFTER DELETE ON missions
            FOR EACH ROW
            BEGIN
                DELETE FROM notifications WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, \'$."mission_id"\')) = OLD.id;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS delete_deleted_missions_from_notifications');
    }
};
