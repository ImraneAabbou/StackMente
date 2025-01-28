<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS delete_deleted_replies_from_notifications');
        DB::unprepared('
            CREATE TRIGGER delete_deleted_replies_from_notifications
            AFTER DELETE ON replies
            FOR EACH ROW
            BEGIN
                DELETE FROM notifications WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, \'$."reply_id"\')) = OLD.id;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS delete_deleted_replies_from_notifications');
    }
};
