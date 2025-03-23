<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS getTopTenUsersBy');
        DB::unprepared('
            CREATE PROCEDURE getTopTenUsersBy(IN period VARCHAR(10))
            BEGIN

                IF period NOT IN ("total", "monthly", "weekly", "daily", "yearly") THEN
                    SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Invalid period value. Must be total, monthly, weekly, daily, or yearly";
                END IF;

                SELECT
                    id,
                    RANK() OVER (
                        ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(stats, CONCAT("$.xp.", period))) AS UNSIGNED) DESC
                    ) rank,
                    username,
                    fullname,
                    avatar,
                    stats
                FROM users
                WHERE deleted_at IS NULL
                LIMIT 10;

            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS getTopTenUsersBy');
    }
};
