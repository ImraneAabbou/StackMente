<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('
            CREATE PROCEDURE getUserWithRankById(IN user_id INT, IN period VARCHAR(10))
            BEGIN
                IF period NOT IN ("total", "monthly", "weekly", "daily", "yearly") THEN
                    SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Invalid period value. Must be total, monthly, weekly, daily, or yearly";
                END IF;

                SELECT
                    u.id,
                    (
                        SELECT COUNT(*)
                        FROM users AS u2
                        WHERE CAST(JSON_UNQUOTE(JSON_EXTRACT(u2.stats, CONCAT(\'$.xp.\', period))) AS UNSIGNED) >
                              CAST(JSON_UNQUOTE(JSON_EXTRACT(u.stats, CONCAT(\'$.xp.\', period))) AS UNSIGNED)
                    ) + 1 AS rank,
                    u.username,
                    u.fullname,
                    u.avatar,
                    u.stats
                FROM users u
                WHERE u.id = user_id;

            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        DB::unprepared('DROP PROCEDURE IF EXISTS getUserWithRankById');
    }
};
