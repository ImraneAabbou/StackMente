<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS increase_xp_after_total_update');
        DB::unprepared("
            CREATE TRIGGER increase_xp_after_total_update
            BEFORE UPDATE ON users
            FOR EACH ROW
            BEGIN
                DECLARE xp_diff INT;

                SET xp_diff = JSON_UNQUOTE(JSON_EXTRACT(NEW.stats, '\$.xp.total')) - JSON_UNQUOTE(JSON_EXTRACT(OLD.stats, '\$.xp.total'));

                IF xp_diff != 0 THEN
                    SET NEW.stats = JSON_SET(
                        NEW.stats,
                        '\$.xp.daily', JSON_UNQUOTE(JSON_EXTRACT(NEW.stats, '\$.xp.daily')) + xp_diff,
                        '\$.xp.weekly', JSON_UNQUOTE(JSON_EXTRACT(NEW.stats, '\$.xp.daily')) + xp_diff,
                        '\$.xp.monthly', JSON_UNQUOTE(JSON_EXTRACT(NEW.stats, '\$.xp.monthly')) + xp_diff,
                        '\$.xp.yearly', JSON_UNQUOTE(JSON_EXTRACT(NEW.stats, '\$.xp.daily')) + xp_diff
                    );
                END IF;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS increase_xp_after_total_update');
    }
};
