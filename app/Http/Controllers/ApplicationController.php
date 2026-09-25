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
            'pass_image' => 'nullable|string',
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

        // Dispatch Discord Webhook with attached ticket pass card
        $this->dispatchDiscordSubmission($app, $validated['pass_image'] ?? null);

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

        // Dispatch Discord Status Announcement Webhook to corresponding department response webhook
        $this->dispatchDiscordStatus($app, $status);

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
     * Internal: Dispatch Discord Submission Webhook (All Submissions Alert).
     */
    protected function dispatchDiscordSubmission(Application $app, ?string $passImageBase64 = null)
    {
        // All applications client-side submission alert webhook
        $webhookUrl = env('DISCORD_WEBHOOK_SUBMISSION') 
            ?: (env('DISCORD_WEBHOOK_ENTRY') 
            ?: 'https://discord.com/api/webhooks/1553103300768047244/FhnaFVOxYvDH62A0q16qotZCj1sUd-Uxue1v24WNykBD54A_JZxHu3WF2h7ZZZdIdTAw');

        if (empty($webhookUrl)) {
            Log::warning("No Discord Webhook URL configured for submissions");
            return;
        }

        $fileName = "entry_pass_{$app->id}.png";
        $hasImage = !empty($passImageBase64);

        $embed = [
            'color' => 0x00eaff,
            'footer' => ['text' => 'NEW ERA ROLEPLAY COMMUNITY • OFFICIAL CITIZEN ENTRY PASS'],
            'timestamp' => now()->toIso8601String()
        ];

        if ($hasImage) {
            $embed['image'] = ['url' => "attachment://{$fileName}"];
        } else {
            $embed['title'] = "📋 NEW " . strtoupper($app->dept_name) . " SUBMITTED";
            $embed['description'] = "Applicant **{$app->character_name}** ({$app->discord_tag})\nTicket Reference: `{$app->id}`\nStatus: 🟡 **PENDING REVIEW**";
        }

        $payload = [
            'content' => "📢 **[NEW ERA ROLEPLAY] NEW ENTRY TICKET APPLICATION RECEIVED**\nApplicant **{$app->character_name}** ({$app->discord_tag}) has submitted an official application. Reference: `{$app->id}`",
            'username' => 'New Era Entry Gateway',
            'embeds' => [$embed]
        ];

        try {
            if ($hasImage) {
                $cleanBase64 = $passImageBase64;
                if (str_contains($cleanBase64, ',')) {
                    $cleanBase64 = substr($cleanBase64, strpos($cleanBase64, ',') + 1);
                }
                $binary = base64_decode($cleanBase64);
                Http::timeout(10)
                    ->attach('files[0]', $binary, $fileName)
                    ->post($webhookUrl, ['payload_json' => json_encode($payload)]);
            } else {
                Http::timeout(6)->post($webhookUrl, $payload);
            }
        } catch (\Exception $e) {
            Log::error("Discord submission webhook failed: " . $e->getMessage());
        }
    }

    /**
     * Internal: Dispatch Discord Status Announcement Webhook (Response Webhooks).
     */
    protected function dispatchDiscordStatus(Application $app, $statusType)
    {
        $respEntry = env('DISCORD_WEBHOOK_RESPONSE_ENTRY') ?: 'https://discord.com/api/webhooks/1552694543529283585/QvAr3vtWRuOF0oElPWOy6hMrTgKVyT9snzDg3nHc2E-HeEE4QPRtCjCblC3quL7j90s-';
        $respPolice = env('DISCORD_WEBHOOK_RESPONSE_POLICE') ?: 'https://discord.com/api/webhooks/1552757720615100436/dCmrdhEkxUXFGBiAmYCpq2u1LMdgaLSbQOnYMnwQdOhdXoqW3tW7O9Rm69-JLo545uz3';
        $respEms = env('DISCORD_WEBHOOK_RESPONSE_EMS') ?: 'https://discord.com/api/webhooks/1552758037570256930/idkLCx1rfjNMef8TluzUZbSwfooSRwJywlPWbM9H-dS2X-PHnyzbqsCFvfnI7_CXOzdr';

        $webhookUrl = match($app->dept) {
            'police' => $respPolice,
            'ems' => $respEms,
            default => $respEntry,
        };

        if (empty($webhookUrl)) return;

        $isApproved = strtolower($statusType) === 'approved';
        $isRejected = strtolower($statusType) === 'rejected';
        $statusWord = $isApproved ? 'ACCEPTED' : ($isRejected ? 'REJECTED' : 'PENDING');
        $statusEmoji = $isApproved ? '✅' : ($isRejected ? '❌' : '⏳');
        $color = $isApproved ? 0x00ff88 : ($isRejected ? 0xff4757 : 0xffa502);

        $userMention = (preg_match('/\d{15,20}/', $app->discord_tag, $m)) ? "<@{$m[0]}>" : "@{$app->discord_tag}";

        if ($isApproved) {
            $content = "{$userMention}, Your whitelist application has been **ACCEPTED** ✅.\n\nPlease check announcements for the next steps regarding your interview.\n\n**RESULT**\n**ACCEPTED** ✅";
        } elseif ($isRejected) {
            $content = "{$userMention}, Your application has been **REJECTED** ❌.\n\nYou may re-apply after 7 days following the server guidelines.\n\n**RESULT**\n**REJECTED** ❌";
        } else {
            $content = "{$userMention}, Your application is currently under **PENDING REVIEW** ⏳.\n\nPlease keep your Discord DMs open for staff contact.";
        }

        $payload = [
            'content' => $content,
            'username' => 'New Era Entry Gateway',
            'embeds' => [
                [
                    'color' => $color,
                    'footer' => ['text' => 'NEW ERA ROLEPLAY COMMUNITY • APPLICATION DECISION'],
                    'timestamp' => now()->toIso8601String()
                ]
            ]
        ];

        try {
            Http::timeout(8)->post($webhookUrl, $payload);
        } catch (\Exception $e) {
            Log::error("Discord status webhook failed: " . $e->getMessage());
        }
    }
}
