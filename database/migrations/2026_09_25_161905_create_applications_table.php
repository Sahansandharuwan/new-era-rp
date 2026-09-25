<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. NET-8492-LK
            $table->string('dept')->default('whitelist');
            $table->string('dept_name')->default('Citizen Entry Ticket');
            $table->string('discord_tag');
            $table->string('steam_hex')->nullable();
            $table->string('age')->default('18');
            $table->string('timezone')->default('GMT+5:30');
            $table->text('experience')->nullable();
            $table->string('character_name');
            $table->string('char_age')->default('25');
            $table->string('char_gender')->default('Specified in Backstory');
            $table->text('backstory')->nullable();
            $table->json('answers')->nullable();
            $table->string('status')->default('Pending'); // Pending, Approved, Rejected
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
