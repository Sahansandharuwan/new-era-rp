/**
 * ============================================================================
 * NEW ERA ROLEPLAY - GLOBAL COMMUNITY CONFIGURATION
 * ============================================================================
 * 
 * INSTRUCTIONS:
 * 1. DISCORD WEBHOOK (MAIN):
 *    Paste your Discord Webhook URL in `discordWebhook` below.
 *    (How to get: Discord Server -> Channel Settings -> Integrations -> Webhooks -> New Webhook -> Copy URL)
 * 
 * 2. DEPARTMENT WEBHOOKS (OPTIONAL):
 *    You can route applications to specific Discord channels by pasting channel webhooks below.
 *    If left empty, all applications will go to the main `discordWebhook`.
 * 
 * 3. FIREBASE REALTIME DATABASE (OPTIONAL - FOR REAL-TIME CLOUD SYNC):
 *    Create a free Firebase project at https://console.firebase.google.com -> Realtime Database.
 *    Paste your URL below in `firebaseDbUrl` (e.g., https://your-app-default-rtdb.firebaseio.com).
 *    Even without Firebase, Discord Webhooks and cloud synchronization will still work!
 */

window.NERP_CONFIG = {
  // MAIN DISCORD WEBHOOK URL (Applications submitted by anyone on the website will be sent here!)
  // PASTE YOUR DISCORD WEBHOOK URL INSIDE THE QUOTES:
  discordWebhook: "https://discord.com/api/webhooks/1553103300768047244/FhnaFVOxYvDH62A0q16qotZCj1sUd-Uxue1v24WNykBD54A_JZxHu3WF2h7ZZZdIdTAw",

  // Department-Specific Channel Webhooks
  departmentWebhooks: {
    whitelist: "https://discord.com/api/webhooks/1553103300768047244/FhnaFVOxYvDH62A0q16qotZCj1sUd-Uxue1v24WNykBD54A_JZxHu3WF2h7ZZZdIdTAw",     // #citizen-tickets channel webhook
    police: "https://discord.com/api/webhooks/1552757720615100436/dCmrdhEkxUXFGBiAmYCpq2u1LMdgaLSbQOnYMnwQdOhdXoqW3tW7O9Rm69-JLo545uz3",        // #police-recruitment channel webhook
    ems: "https://discord.com/api/webhooks/1552758037570256930/idkLCx1rfjNMef8TluzUZbSwfooSRwJywlPWbM9H-dS2X-PHnyzbqsCFvfnI7_CXOzdr",           // #ems-applications channel webhook
    mechanic: "",      // #mechanic-desk channel webhook (uses default if empty)
    staff: "",         // #staff-applications channel webhook (uses default if empty)
    business: ""       // #business-registrations channel webhook (uses default if empty)
  },

  // Discord Bot Identity in messages
  botName: "New Era Entry Gateway",
  botAvatar: "", // MUST be a full http/https image URL (e.g. https://i.imgur.com/example.png) or left empty!

  // Role mentions (Optional - Discord Role IDs to @ping when an application arrives)
  mentionRoles: {
    whitelist: "",     // Role ID to ping for citizen tickets
    police: "",        // Role ID to ping for police applications
    ems: "",           // Role ID to ping for EMS applications
    mechanic: "",      // Role ID to ping for Mechanic applications
    staff: "",         // Role ID to ping for Staff applications
    business: ""       // Role ID to ping for Gang/Business applications
  },

  // FiveM Server & Community Info
  serverName: "NEW ERA ROLEPLAY",
  discordInvite: "https://discord.com/invite/bZ2YpSrq8",
  cfxJoin: "fivem://connect/cfx.re/join/xxxxxx",
  directIp: "connect 185.207.250.1:30120",
  maxSlots: 128,
  serverStatus: "ONLINE",

  // Firebase Realtime Database URL for real-time live sync across all devices
  // e.g., "https://new-era-roleplay-default-rtdb.firebaseio.com"
  firebaseDbUrl: "",

  // Master Admin Passcode
  adminPasscode: "newera2026"
};
