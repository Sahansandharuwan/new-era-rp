<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ApplicationController extends Controller
{
    /**
     * Get all applications from MySQL database.
     */
    public function index()
    {
        $apps = Application::orderBy('created_at', 'desc')->get();
        return response()->json($apps);
    }

    /**
     * Submit a new application, save to MySQL, and dispatch to Discord Webhook.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'dept' => 'nullable|string',
            'dept_name' => 'nullable|string',
            'discord_tag' => 'required|string',
            'steam_hex' => 'nullable|string',
            'age' => 'nullable|string',
            'timezone' => 'nullable|string',
            'experience' => 'nullable|string',
            'character_name' => 'required|string',
            'char_age' => 'nullable|string',
            'char_gender' => 'nullable|string',
            'backstory' => 'nullable|string',
            'answers' => 'nullable|array',
        ]);

        $ticketId = 'NET-' . rand(1000, 9999) . '-LK';

        $app = Application::create([
            'id' => $ticketId,
            'dept' => $validated['dept'] ?? 'whitelist',
            'dept_name' => $validated['dept_name'] ?? 'Citizen Entry Ticket',
            'discord_tag' => trim($validated['discord_tag']),
            'steam_hex' => trim($validated['steam_hex'] ?? ''),
            'age' => $validated['age'] ?? '18',
            'timezone' => $validated['timezone'] ?? 'GMT+5:30',
            'experience' => $validated['experience'] ?? 'None specified',
            'character_name' => trim($validated['character_name']),
            'char_age' => $validated['char_age'] ?? '25',
            'char_gender' => $validated['char_gender'] ?? 'Specified in Backstory',
            'backstory' => $validated['backstory'] ?? '',
            'answers' => $validated['answers'] ?? [],
            'status' => 'Pending',
            'notes' => 'New submission received via web portal.',
        ]);

        // Dispatch Discord Webhook
        $this->dispatchDiscordSubmission($app);

        return response()->json([
            'success' => true,
            'message' => "Entry Ticket #{$app->id} submitted and saved to database!",
            'application' => $app
        ], 201);
    }

    /**
     * Track status of an application by ID or Discord Tag.
     */
    public function track(Request $request)
    {
        $query = trim($request->input('query', ''));
        if (empty($query)) {
            return response()->json(['success' => false, 'message' => 'Please provide a Ticket ID or Discord Tag.'], 400);
        }

        $app = Application::where('id', $query)
            ->orWhere('discord_tag', 'like', "%{$query}%")
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$app) {
            return response()->json(['success' => false, 'message' => 'No active application found matching this reference.'], 404);
        }

        return response()->json(['success' => true, 'application' => $app]);
    }

    /**
     * Update application review status and notes.
     */
    public function updateStatus(Request $request, $id)
    {
        $app = Application::find($id);
        if (!$app) {
            return response()->json(['success' => false, 'message' => 'Application not found'], 404);
        }

        $status = $request->input('status', $app->status);
        $notes = $request->input('notes', $app->notes);

        $app->status = $status;
        if ($notes !== null) {
            $app->notes = $notes;
        }
        $app->save();

        // Discord Status Announcement disabled as requested (only new ticket submissions post to Discord)
        // $this->dispatchDiscordStatus($app, $status);

        return response()->json([
            'success' => true,
            'message' => "Application #{$app->id} marked as {$status}",
            'application' => $app
        ]);
    }

    /**
     * Permanently delete an application.
     */
    public function destroy($id)
    {
        $app = Application::find($id);
        if ($app) {
            $app->delete();
        }

        return response()->json(['success' => true, 'message' => "Application #{$id} deleted."]);
    }

    /**
     * Internal: Dispatch Discord Submission Webhook.
     */
    protected function dispatchDiscordSubmission(Application $app)
    {
        $entryHook = env('DISCORD_WEBHOOK_ENTRY') ?: 'https://discord.com/api/webhooks/1552694543529283585/QvAr3vtWRuOF0oElPWOy6hMrTgKVyT9snzDg3nHc2E-HeEE4QPRtCjCblC3quL7j90s-';
        $policeHook = env('DISCORD_WEBHOOK_POLICE') ?: 'https://discord.com/api/webhooks/1552757720615100436/dCmrdhEkxUXFGBiAmYCpq2u1LMdgaLSbQOnYMnwQdOhdXoqW3tW7O9Rm69-JLo545uz3';
        $emsHook = env('DISCORD_WEBHOOK_EMS') ?: 'https://discord.com/api/webhooks/1552758037570256930/idkLCx1rfjNMef8TluzUZbSwfooSRwJywlPWbM9H-dS2X-PHnyzbqsCFvfnI7_CXOzdr';

        $webhookUrl = match($app->dept) {
            'police' => $policeHook,
            'ems' => $emsHook,
            default => $entryHook,
        };

        if (empty($webhookUrl)) {
            Log::warning("No Discord Webhook URL configured for dept: {$app->dept}");
            return;
        }

        $payload = [
            'content' => "🔔 **[NEW ERA ROLEPLAY] NEW ENTRY TICKET APPLICATION RECEIVED**",
            'username' => 'New Era Entry Gateway',
            'embeds' => [
                [
                    'title' => "📋 NEW " . strtoupper($app->dept_name) . " SUBMITTED",
                    'description' => "Applicant **{$app->character_name}** ({$app->discord_tag}) has submitted an official application.",
                    'color' => 0x00eaff,
                    'fields' => [
                        ['name' => '🎫 Ticket Reference', 'value' => "`{$app->id}`", 'inline' => true],
                        ['name' => '💬 Discord User', 'value' => "{$app->discord_tag}", 'inline' => true],
                        ['name' => '👤 Character Name', 'value' => "{$app->character_name}", 'inline' => true],
                        ['name' => '🎂 Real Age', 'value' => "{$app->age} Years Old", 'inline' => true],
                        ['name' => '🏢 Department', 'value' => "{$app->dept_name}", 'inline' => true],
                        ['name' => '📅 Submitted Date', 'value' => $app->created_at->format('Y-m-d'), 'inline' => true],
                        ['name' => '⚖️ Review Status', 'value' => "🟡 **PENDING REVIEW**", 'inline' => true]
                    ],
                    'footer' => ['text' => 'NEW ERA ROLEPLAY COMMUNITY • AUTOMATED ENTRY SYSTEM'],
                    'timestamp' => now()->toIso8601String()
                ]
            ]
        ];

        try {
            Http::timeout(6)->post($webhookUrl, $payload);
        } catch (\Exception $e) {
            Log::error("Discord submission webhook failed: " . $e->getMessage());
        }
    }

    /**
     * Internal: Dispatch Discord Status Announcement Webhook.
     */
    protected function dispatchDiscordStatus(Application $app, $statusType)
    {
        $webhookUrl = match($app->dept) {
            'police' => env('DISCORD_WEBHOOK_POLICE', env('DISCORD_WEBHOOK_ENTRY')),
            'ems' => env('DISCORD_WEBHOOK_EMS', env('DISCORD_WEBHOOK_ENTRY')),
            default => env('DISCORD_WEBHOOK_ENTRY'),
        };

        if (empty($webhookUrl)) return;

        $isApproved = strtolower($statusType) === 'approved';
        $isRejected = strtolower($statusType) === 'rejected';
        $statusWord = $isApproved ? 'ACCEPTED' : ($isRejected ? 'REJECTED' : 'PENDING');
        $statusEmoji = $isApproved ? '✅' : ($isRejected ? '❌' : '⏳');
        $color = $isApproved ? 0x2ed573 : ($isRejected ? 0xff4757 : 0xffa502);

        $payload = [
            'content' => "📢 **[NEW ERA ROLEPLAY] APPLICATION STATUS UPDATE: {$app->id}**",
            'username' => 'New Era Entry Gateway',
            'embeds' => [
                [
                    'title' => "{$statusEmoji} APPLICATION {$statusWord} - {$app->character_name}",
                    'description' => "Applicant **{$app->character_name}** ({$app->discord_tag}), your application has been officially marked as **{$statusWord}** by server administration.",
                    'color' => $color,
                    'fields' => [
                        ['name' => '🎫 Ticket Reference', 'value' => "`{$app->id}`", 'inline' => true],
                        ['name' => '🏢 Department', 'value' => "{$app->dept_name}", 'inline' => true],
                        ['name' => '⚖️ Decision', 'value' => "{$statusEmoji} **{$statusWord}**", 'inline' => true],
                        ['name' => '📝 Staff Remarks', 'value' => $app->notes ?: 'WELCOME TO NEW ERA ROLEPLAY COMMUNITY', 'inline' => false]
                    ],
                    'footer' => ['text' => 'NEW ERA ROLEPLAY COMMUNITY • AUTOMATED ENTRY SYSTEM'],
                    'timestamp' => now()->toIso8601String()
                ]
            ]
        ];

        try {
            Http::timeout(6)->post($webhookUrl, $payload);
        } catch (\Exception $e) {
            Log::error("Discord status webhook failed: " . $e->getMessage());
        }
    }
}
