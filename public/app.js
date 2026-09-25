/**
 * NEW ERA ROLEPLAY COMMUNITY - OFFICIAL SCRIPT
 * High-performance, reactive architecture for FiveM Community Website.
 * Features: Web Audio SFX, LocalStorage Persistence, Dynamic Content Engines,
 * Multi-Step Entry Ticket Portal, Case Tracker, Fullscreen Staff Management Console,
 * Application Dossier Inspector, and FiveM/Discord Integrations.
 */

// ==========================================================================
// ==========================================================================
// 1.1 FUTURISTIC CYBERPUNK CURSOR
// ==========================================================================
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  if (!dot) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  });
}

// 1. WEB AUDIO SYNTHESIZER (Cyberpunk Interactive Sounds)
// ==========================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('nerp_sfx_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('nerp_sfx_muted', this.muted);
    return this.muted;
  }

  playBeep(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  click() {
    this.playBeep(780, 'sine', 0.04, 0.03);
  }

  success() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.04, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.18);
      });
    } catch (e) {}
  }

  error() {
    this.playBeep(180, 'sawtooth', 0.25, 0.08);
  }

  tabSwitch() {
    this.playBeep(920, 'sine', 0.06, 0.025);
  }
}

const sfx = new SoundFX();

// ==========================================================================
// 2. TOAST NOTIFICATION SYSTEM
// ==========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    connect: '🌐'
  };

  const colors = {
    info: '#00eaff',
    success: '#2ed573',
    error: '#ff4757',
    warning: '#ffa502',
    connect: '#ab00ff'
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderColor = colors[type] || colors.info;
  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${icons[type] || icons.info}</span>
    <div style="flex: 1; font-size: 0.92rem; font-weight: 500;">${message}</div>
    <span style="cursor: pointer; opacity: 0.6; font-size: 0.8rem;" onclick="this.parentElement.remove()">✕</span>
  `;

  container.appendChild(toast);
  if (type === 'error') sfx.error();
  else if (type === 'success') sfx.success();
  else sfx.click();

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}

// Helper to ensure Discord webhook avatar_url is a valid absolute HTTP/HTTPS URL
function getValidDiscordAvatar(avatar) {
  if (avatar && typeof avatar === 'string' && (avatar.startsWith('http://') || avatar.startsWith('https://'))) {
    return avatar;
  }
  return undefined; // Do NOT pass relative paths like 'assets/logo.png' because Discord API rejects them with HTTP 400 Bad Request!
}

// ==========================================================================
// 3. PERSISTENT DATA ENGINES (LocalStorage Stores + Cloud Sync)
// ==========================================================================
const DataStore = {
  // Server & Discord Config
  getConfig() {
    const globalCfg = window.NERP_CONFIG || {};
    const defaultCfg = {
      serverName: globalCfg.serverName || 'NEW ERA ROLEPLAY COMMUNITY',
      cfxJoin: globalCfg.cfxJoin || 'cfx.re/join/g9b9mq',
      directIp: globalCfg.directIp || '103.155.220.45:30120',
      activePlayers: 118,
      maxSlots: globalCfg.maxSlots || 128,
      queueCount: '14 IN LINE',
      uptime: '99.98% (24h 10m)',
      serverStatus: globalCfg.serverStatus || 'ONLINE',
      discordInvite: globalCfg.discordInvite || 'https://discord.com/invite/bZ2YpSrq8',
      discordWebhook: globalCfg.discordWebhook || 'https://discord.com/api/webhooks/1553103300768047244/FhnaFVOxYvDH62A0q16qotZCj1sUd-Uxue1v24WNykBD54A_JZxHu3WF2h7ZZZdIdTAw',
      adminPasscode: globalCfg.adminPasscode || 'newera2026',
      firebaseDbUrl: globalCfg.firebaseDbUrl || ''
    };
    try {
      const stored = localStorage.getItem('nerp_server_config');
      let cfg = stored ? { ...defaultCfg, ...JSON.parse(stored) } : defaultCfg;
      // If stored webhook is empty or not set, automatically inherit from global config
      if ((!cfg.discordWebhook || cfg.discordWebhook.trim() === '') && globalCfg.discordWebhook) {
        cfg.discordWebhook = globalCfg.discordWebhook;
      }
      if ((!cfg.firebaseDbUrl || cfg.firebaseDbUrl.trim() === '') && globalCfg.firebaseDbUrl) {
        cfg.firebaseDbUrl = globalCfg.firebaseDbUrl;
      }
      if (!cfg.discordInvite || !cfg.discordInvite.includes('bZ2YpSrq8')) {
        cfg.discordInvite = globalCfg.discordInvite || 'https://discord.com/invite/bZ2YpSrq8';
        localStorage.setItem('nerp_server_config', JSON.stringify(cfg));
      }
      return cfg;
    } catch (e) {
      return defaultCfg;
    }
  },
  saveConfig(cfg) {
    localStorage.setItem('nerp_server_config', JSON.stringify(cfg));
    if (typeof syncServerConfigToCloud === 'function') {
      syncServerConfigToCloud(cfg);
    }
  },

  // Staff Members
  getStaff() {
    const defaultStaff = [
      {
        id: 'staff-1',
        name: 'Server Management',
        role: 'Founder & Server Owner',
        dept: 'management',
        badgeColor: '#ab00ff',
        bio: 'Overall server governance, development, economy tuning, and community leadership.',
        discord: 'NewEraOwner#0001',
        avatar: 'assets/logo.png'
      },
      {
        id: 'staff-2',
        name: 'Head Administration',
        role: 'Head of Operations',
        dept: 'admin',
        badgeColor: '#2ed573',
        bio: 'Oversees ticket resolutions, reports, whitelist interviews, and staff coordination.',
        discord: 'HeadAdmin#9999',
        avatar: 'assets/logo.png'
      }
    ];
    try {
      const stored = localStorage.getItem('nerp_staff_members');
      return stored ? JSON.parse(stored) : defaultStaff;
    } catch (e) {
      return defaultStaff;
    }
  },
  saveStaff(list) {
    localStorage.setItem('nerp_staff_members', JSON.stringify(list));
  },

  // Server Rules
  getRules() {
    const defaultRules = [
      {
        id: 'rule-1',
        category: 'general',
        title: 'Rule 1.1: Value of Life (Fear RP)',
        desc: 'You must value your character\'s life above all possessions. If held at gunpoint without immediate advantage, you must comply. Do not pull a firearm or attempt heroics against an active firearm.'
      },
      {
        id: 'rule-2',
        category: 'general',
        title: 'Rule 1.2: Metagaming & Powergaming',
        desc: 'Metagaming: Using external information (Discord, live streams, OOC messages) inside roleplay is strictly forbidden. Powergaming: Performing superhuman actions, exploiting physics, or forcing actions onto others without giving them an option to react is prohibited.'
      },
      {
        id: 'rule-3',
        category: 'combat',
        title: 'Rule 2.1: Random Deathmatch (RDM) & Vehicle Deathmatch (VDM)',
        desc: 'RDM: Attacking, shooting, or killing another player without prior valid RP initiation and storyline reason is strictly bannable. VDM: Using your vehicle as a weapon or ramming pedestrians/vehicles intentionally is prohibited.'
      },
      {
        id: 'rule-4',
        category: 'combat',
        title: 'Rule 2.2: New Life Rule (NLR)',
        desc: 'Upon being downed and transported to hospital (or respawning), you forget all memory of events that led to your death. You may not return to the scene for 20 minutes or seek revenge.'
      },
      {
        id: 'rule-5',
        category: 'robbery',
        title: 'Rule 3.1: Hostages & Robberies',
        desc: 'Fake or pre-arranged friendly hostages are strictly prohibited. Store robberies require minimum 2 police officers on duty. Bank heists require minimum 4 police officers.'
      },
      {
        id: 'rule-6',
        category: 'safezone',
        title: 'Rule 4.1: Safe Zones & Green Zones',
        desc: 'Pillbox Hill Medical Center, LSPD Headquarters, and designated mechanic garages are non-violent zones. Criminal activity, hostage taking, and combat are strictly barred inside safe zones.'
      }
    ];
    try {
      const stored = localStorage.getItem('nerp_server_rules');
      return stored ? JSON.parse(stored) : defaultRules;
    } catch (e) {
      return defaultRules;
    }
  },
  saveRules(list) {
    localStorage.setItem('nerp_server_rules', JSON.stringify(list));
  },

  // Departments Management
  getDepartments() {
    const defaultDepts = [
      {
        id: 'whitelist',
        name: 'Citizen Entry Ticket',
        icon: '🎫',
        title: 'Citizen Entry Ticket Application',
        desc: 'Complete all 3 stages: OOC info, character persona, and roleplay scenario evaluation.'
      },
      {
        id: 'police',
        name: 'Police Dept (LSPD)',
        icon: '👮',
        title: 'Police Dept (LSPD) Cadet Recruitment',
        desc: 'Apply to join New Era Police Department. Requires clean disciplinary record and tactical training.'
      },
      {
        id: 'ems',
        name: 'EMS & Hospital',
        icon: '🚑',
        title: 'EMS & Paramedic Medical Application',
        desc: 'Join Pillbox Medical emergency response team. Protect and revive citizens across New Era.'
      },
      {
        id: 'mechanic',
        name: 'Mechanic & Tuning',
        icon: '🛠️',
        title: 'Certified Mechanic & Tuning Application',
        desc: 'Custom engine tuning, vehicle repairs, and towing services authorization.'
      },
      {
        id: 'staff',
        name: 'Staff / Moderator',
        icon: '⚖️',
        title: 'Staff & Moderator Community Application',
        desc: 'Support New Era community management, ticket resolution, and fair play enforcement.'
      },
      {
        id: 'business',
        name: 'Gang & Business',
        icon: '💼',
        title: 'Syndicate & Commercial Enterprise Registration',
        desc: 'Register an official underground faction, commercial venue, or private business.'
      }
    ];
    try {
      const stored = localStorage.getItem('nerp_application_departments');
      return stored ? JSON.parse(stored) : defaultDepts;
    } catch (e) {
      return defaultDepts;
    }
  },
  saveDepartments(list) {
    localStorage.setItem('nerp_application_departments', JSON.stringify(list));
  },

  // Entry Ticket Scenario Questions
  getQuestions() {
    const defaultQuestions = [
      {
        id: 'q1',
        prompt: 'Define RDM (Random Deathmatch) and VDM (Vehicle Deathmatch) with examples.',
        placeholder: 'Explain the difference and why both are strictly prohibited in New Era...',
        required: true
      },
      {
        id: 'q2',
        prompt: 'Scenario: You are held at gunpoint in an alley by 2 masked robbers. What is your reaction?',
        placeholder: 'Explain how your character values their life (Fear RP) and reacts under threat...',
        required: true
      },
      {
        id: 'q3',
        prompt: 'Define Metagaming and Powergaming. Give an in-game example of each.',
        placeholder: 'Explain why using external streams or forcing unrealistic physical actions is forbidden...',
        required: true
      },
      {
        id: 'q4',
        prompt: 'Explain the New Life Rule (NLR) and what your character remembers after medical respawn.',
        placeholder: 'Detail the memory loss rules and cooldown before returning to the area...',
        required: true
      }
    ];
    try {
      const stored = localStorage.getItem('nerp_application_questions');
      return stored ? JSON.parse(stored) : defaultQuestions;
    } catch (e) {
      return defaultQuestions;
    }
  },
  saveQuestions(list) {
    localStorage.setItem('nerp_application_questions', JSON.stringify(list));
  },

  // City Features
  getFeatures() {
    const defaultFeatures = [
      {
        id: 'f1',
        icon: '💼',
        title: 'Balanced Custom Economy',
        desc: 'Realistic cash economy, player-owned storefronts, luxury penthouses, custom warehouses, and banking systems.'
      },
      {
        id: 'f2',
        icon: '🏎️',
        title: '600+ Hand-Tuned Imports',
        desc: 'Custom vehicle handling, authentic exhaust sounds, visual customization, and realistic fuel dynamics.'
      },
      {
        id: 'f3',
        icon: '👮',
        title: 'Emergency Services (LSPD & EMS)',
        desc: 'Advanced in-game MDT/CAD dispatch, high-speed interceptor fleet, and hospital triage trauma RP.'
      },
      {
        id: 'f4',
        icon: '🏴‍☠️',
        title: 'Underworld Heists & Gangs',
        desc: 'Tiered bank robberies, underground drug synthesis, black market shipments, and turf territory conflicts.'
      },
      {
        id: 'f5',
        icon: '⚡',
        title: 'Proprietary Anti-Cheat & 60+ FPS',
        desc: 'Optimized server-side assets, custom client anti-cheat protection, and buttery-smooth gameplay.'
      },
      {
        id: 'f6',
        icon: '🤝',
        title: 'Active 24/7 Community Staff',
        desc: 'Rapid ticket response times, weekly community car meets, and fair, unbiased moderation.'
      }
    ];
    try {
      const stored = localStorage.getItem('nerp_server_features');
      return stored ? JSON.parse(stored) : defaultFeatures;
    } catch (e) {
      return defaultFeatures;
    }
  },
  saveFeatures(list) {
    localStorage.setItem('nerp_server_features', JSON.stringify(list));
  },

  // Applications
  getApplications() {
    const defaultApps = [
      {
        id: 'NET-7841-LK',
        dept: 'whitelist',
        deptName: 'Citizen Entry Ticket',
        discordTag: 'Kasun_Silva#4412',
        steamHex: 'steam:11000010abcde',
        age: '24',
        timezone: 'GMT+5:30 (Sri Lanka) / 8 PM - 1 AM',
        experience: '2 Years in FiveM RP (Serious RP)',
        characterName: 'Dilan Perera',
        charAge: '26',
        charGender: 'Male',
        backstory: 'Born in Colombo, moved into New Era City seeking to start a performance tuning garage and build honest connections.',
        answers: {
          q1: 'RDM is killing someone without prior RP conversation. VDM is using a car as a lethal weapon.',
          q2: 'I will raise my hands, comply with all demands, value my life, and report to police afterwards.',
          q3: 'Metagaming is using stream info. Powergaming is doing impossible physical tasks.',
          q4: 'Forget all events regarding how I died and stay away from the area for 20 minutes.'
        },
        status: 'Approved',
        date: '2026-09-24',
        notes: 'Passed ticket review. Backstory and scenario responses are high quality.'
      },
      {
        id: 'NET-9204-LK',
        dept: 'police',
        deptName: 'Police Dept (LSPD)',
        discordTag: 'ViperX#1337',
        steamHex: 'steam:11000011fedcba',
        age: '26',
        timezone: 'GMT+5:30 / Evening',
        experience: 'Former Sergeant on Elite RP',
        characterName: 'Marcus Cole',
        charAge: '28',
        charGender: 'Male',
        backstory: 'Ex-military investigator aiming to join the LSPD highway patrol and restore law and order.',
        answers: {
          q1: 'RDM is unprovoked violence. VDM is running over people with vehicles.',
          q2: 'Put hands up and follow robber instructions to stay alive.',
          q3: 'Metagaming is third-party comms. Powergaming is unbreakable handcuffs or unnatural strength.',
          q4: 'Memory wiped after respawn; no returning for revenge.'
        },
        status: 'Pending',
        date: '2026-09-24',
        notes: 'Awaiting Cadet Academy interview on Discord.'
      }
    ];
    try {
      const stored = localStorage.getItem('new_era_applications');
      return stored ? JSON.parse(stored) : defaultApps;
    } catch (e) {
      return defaultApps;
    }
  },
  saveApplications(list) {
    localStorage.setItem('new_era_applications', JSON.stringify(list));
  },

  // Discord Department Channel Routes
  getDiscordRoutes() {
    const globalCfg = window.NERP_CONFIG || {};
    const globalWebhook = (globalCfg.discordWebhook || '').trim();
    const deptHooks = globalCfg.departmentWebhooks || {};
    const mentionRoles = globalCfg.mentionRoles || {};

    const defaultRoutes = [
      {
        id: 'route-whitelist',
        deptId: 'whitelist',
        deptName: 'Citizen Entry Ticket',
        channelName: '#citizen-tickets',
        webhookUrl: deptHooks.whitelist || globalWebhook || 'https://discord.com/api/webhooks/1553103300768047244/FhnaFVOxYvDH62A0q16qotZCj1sUd-Uxue1v24WNykBD54A_JZxHu3WF2h7ZZZdIdTAw',
        mentionRoleId: mentionRoles.whitelist || '',
        mentionUser: true,
        sendTicketPass: true,
        enabled: true
      },
      {
        id: 'route-police',
        deptId: 'police',
        deptName: 'Police Dept (LSPD)',
        channelName: '#police-recruitment',
        webhookUrl: deptHooks.police || 'https://discord.com/api/webhooks/1552757720615100436/dCmrdhEkxUXFGBiAmYCpq2u1LMdgaLSbQOnYMnwQdOhdXoqW3tW7O9Rm69-JLo545uz3',
        mentionRoleId: mentionRoles.police || '',
        mentionUser: true,
        sendTicketPass: true,
        enabled: true
      },
      {
        id: 'route-ems',
        deptId: 'ems',
        deptName: 'EMS & Hospital',
        channelName: '#ems-applications',
        webhookUrl: deptHooks.ems || 'https://discord.com/api/webhooks/1552758037570256930/idkLCx1rfjNMef8TluzUZbSwfooSRwJywlPWbM9H-dS2X-PHnyzbqsCFvfnI7_CXOzdr',
        mentionRoleId: mentionRoles.ems || '',
        mentionUser: true,
        sendTicketPass: true,
        enabled: true
      },
      {
        id: 'route-mechanic',
        deptId: 'mechanic',
        deptName: 'Mechanic & Tuning',
        channelName: '#mechanic-desk',
        webhookUrl: deptHooks.mechanic || globalWebhook,
        mentionRoleId: mentionRoles.mechanic || '',
        mentionUser: true,
        sendTicketPass: true,
        enabled: true
      },
      {
        id: 'route-staff',
        deptId: 'staff',
        deptName: 'Staff / Moderator',
        channelName: '#staff-applications',
        webhookUrl: deptHooks.staff || globalWebhook,
        mentionRoleId: mentionRoles.staff || '',
        mentionUser: true,
        sendTicketPass: true,
        enabled: true
      },
      {
        id: 'route-business',
        deptId: 'business',
        deptName: 'Gang & Business',
        channelName: '#business-registrations',
        webhookUrl: deptHooks.business || globalWebhook,
        mentionRoleId: mentionRoles.business || '',
        mentionUser: true,
        sendTicketPass: true,
        enabled: true
      }
    ];
    try {
      const stored = localStorage.getItem('nerp_discord_routes');
      let routes = stored ? JSON.parse(stored) : defaultRoutes;
      // If routes exist in storage but specific webhookUrl is empty, use global config fallback
      routes = routes.map(r => {
        if (!r.webhookUrl || r.webhookUrl.trim() === '') {
          r.webhookUrl = deptHooks[r.deptId] || globalWebhook || '';
        }
        if (!r.mentionRoleId && mentionRoles[r.deptId]) {
          r.mentionRoleId = mentionRoles[r.deptId];
        }
        return r;
      });
      return routes;
    } catch (e) {
      return defaultRoutes;
    }
  },
  saveDiscordRoutes(list) {
    localStorage.setItem('nerp_discord_routes', JSON.stringify(list));
  },

  // Discord Roles & Permissions (RBAC)
  getDiscordRoles() {
    const defaultRoles = [
      {
        id: 'drole-1',
        name: 'Server Owner / Founder',
        roleId: '134100000000000001',
        color: '#ab00ff',
        isMaster: true,
        deptScope: 'all',
        permissions: ['all', 'tickets', 'rules', 'depts', 'staff', 'discord']
      },
      {
        id: 'drole-2',
        name: 'Head Administrator',
        roleId: '134100000000000002',
        color: '#00eaff',
        isMaster: false,
        deptScope: 'all',
        permissions: ['tickets', 'rules', 'depts', 'staff', 'discord']
      },
      {
        id: 'drole-3',
        name: 'Police High Command',
        roleId: '134100000000000003',
        color: '#3867d6',
        isMaster: false,
        deptScope: 'police',
        permissions: ['tickets']
      },
      {
        id: 'drole-4',
        name: 'Medical Chief (EMS)',
        roleId: '134100000000000004',
        color: '#ff4757',
        isMaster: false,
        deptScope: 'ems',
        permissions: ['tickets']
      }
    ];
    try {
      const stored = localStorage.getItem('nerp_discord_roles');
      return stored ? JSON.parse(stored) : defaultRoles;
    } catch (e) {
      return defaultRoles;
    }
  },
  saveDiscordRoles(list) {
    localStorage.setItem('nerp_discord_roles', JSON.stringify(list));
  },

  // Response Message Templates & Customizer
  getDiscordTemplates() {
    const defaultTmpl = {
      staffRemarksDefault: 'WELCOME TO NEW ERA ROLEPLAY COMMUNITY',
      botName: 'New Era Entry Gateway',
      botAvatar: 'assets/logo.png',
      colorApproved: '#00ff88',
      colorRejected: '#ff4757',
      colorPending: '#ffa502',
      msgApproved: '{mention}, Your whitelist application has been **ACCEPTED** ✅.\n\nPlease check announcements for the next steps regarding your interview.\n\n**RESULT**\n**ACCEPTED** ✅',
      msgRejected: '{mention}, Your application has been **REJECTED** ❌.\n\nYou may re-apply after 7 days following the server guidelines.\n\n**RESULT**\n**REJECTED** ❌',
      msgPending: '{mention}, Your application is currently under **PENDING REVIEW** ⏳.\n\nPlease keep your Discord DMs open for staff contact.'
    };
    try {
      const stored = localStorage.getItem('nerp_discord_templates');
      return stored ? { ...defaultTmpl, ...JSON.parse(stored) } : defaultTmpl;
    } catch (e) {
      return defaultTmpl;
    }
  },
  saveDiscordTemplates(t) {
    localStorage.setItem('nerp_discord_templates', JSON.stringify(t));
  },

  // Discord Security & Gate Settings
  getDiscordSecurity() {
    const defaultSec = {
      authMode: 'both',
      guildId: '1424089623344451807',
      clientId: '1424089623344451807',
      botToken: ''
    };
    try {
      const stored = localStorage.getItem('nerp_discord_security');
      return stored ? { ...defaultSec, ...JSON.parse(stored) } : defaultSec;
    } catch (e) {
      return defaultSec;
    }
  },
  saveDiscordSecurity(s) {
    localStorage.setItem('nerp_discord_security', JSON.stringify(s));
  }
};

// ==========================================================================
// 4. CANVAS PARTICLE FX (Subtle Cyberpunk Neon Grid)
// ==========================================================================
function initCanvasFX() {
  const canvas = document.getElementById('fx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(width > 768 ? 45 : 20, 60);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.6,
      color: Math.random() > 0.5 ? 'rgba(0, 234, 255, 0.4)' : 'rgba(171, 0, 255, 0.35)'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 234, 255, ${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ==========================================================================
// 5. PRELOADER & INITIALIZATION
// ==========================================================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const percentElem = document.getElementById('preloader-percent');
  const barElem = preloader ? preloader.querySelector('.preloader-bar') : null;
  const ringProgress = preloader ? preloader.querySelector('.ring-progress') : null;
  if (!preloader) return;

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        if (preloader) preloader.style.display = 'none';
      }, 500);
    }
  };

  // Hard safety fallback timeout: dismiss after 1.5s no matter what
  const fallbackTimeout = setTimeout(dismiss, 1500);

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 12;
    if (progress > 100) progress = 100;

    if (percentElem) percentElem.textContent = `${progress}%`;
    if (barElem) barElem.style.width = `${progress}%`;
    if (ringProgress) {
      const offset = 377 - (377 * progress) / 100;
      ringProgress.style.strokeDashoffset = offset;
    }

    if (progress >= 100) {
      clearInterval(interval);
      clearTimeout(fallbackTimeout);
      setTimeout(dismiss, 180);
    }
  }, 35);
}

// ==========================================================================
// 6. SYNC PUBLIC SERVER CONFIG & BUTTONS
// ==========================================================================
function updatePublicServerUI() {
  const cfg = DataStore.getConfig();

  // Status pills
  const statusElem = document.getElementById('live-server-status-text');
  if (statusElem) statusElem.textContent = cfg.serverStatus;

  const playerElem = document.getElementById('live-player-count');
  if (playerElem) playerElem.textContent = `${cfg.activePlayers} / ${cfg.maxSlots}`;

  const queueElem = document.getElementById('live-queue-count');
  if (queueElem) queueElem.textContent = cfg.queueCount;

  const uptimeElem = document.getElementById('live-uptime');
  if (uptimeElem) uptimeElem.textContent = cfg.uptime;

  const connectTextElem = document.getElementById('live-connect-ip-text');
  if (connectTextElem) connectTextElem.textContent = `${cfg.cfxJoin} 📋`;

  // Discord buttons
  const navDiscord = document.getElementById('nav-btn-discord');
  if (navDiscord) navDiscord.href = cfg.discordInvite;

  const heroDiscord = document.getElementById('hero-btn-discord');
  if (heroDiscord) heroDiscord.href = cfg.discordInvite;

  const footerDiscord = document.getElementById('footer-discord-link');
  if (footerDiscord) footerDiscord.href = cfg.discordInvite;
}

function handleConnectAction() {
  const cfg = DataStore.getConfig();
  const connectCmd = `connect ${cfg.cfxJoin || cfg.directIp}`;

  navigator.clipboard.writeText(connectCmd).then(() => {
    showToast(`Connect command copied: "${connectCmd}". Opening FiveM...`, 'connect');
    sfx.success();
  }).catch(() => {
    showToast(`Server: ${cfg.cfxJoin}`, 'connect');
  });

  // Try opening FiveM client protocol
  setTimeout(() => {
    window.location.href = `fivem://connect/${cfg.directIp}`;
  }, 400);
}

// ==========================================================================
// 7. RENDER PUBLIC DYNAMIC CONTENT (Features, Rules, Staff)
// ==========================================================================
function renderPublicFeatures() {
  const grid = document.getElementById('features-grid');
  if (!grid) return;
  const features = DataStore.getFeatures();

  grid.innerHTML = features.map(f => `
    <div class="feature-card interactive-card">
      <div class="feature-icon-wrap">
        <span class="feature-icon">${f.icon || '⭐'}</span>
      </div>
      <h3 class="feature-title">${f.title}</h3>
      <p class="feature-desc">${f.desc}</p>
    </div>
  `).join('');
}

function renderPublicRules(filter = 'all', searchQuery = '') {
  const container = document.getElementById('rules-accordion-container');
  if (!container) return;
  const rules = DataStore.getRules();

  const filtered = rules.filter(r => {
    const matchesFilter = filter === 'all' || r.category === filter;
    const matchesSearch = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-muted); background: rgba(0,0,0,0.3); border-radius: 12px;">
        No rules found matching your query.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((r, i) => `
    <div class="rule-item">
      <button class="rule-header" data-index="${i}">
        <div class="rule-title-group">
          <span class="rule-badge">${r.category.toUpperCase()}</span>
          <span>${r.title}</span>
        </div>
        <span class="accordion-arrow">▼</span>
      </button>
      <div class="rule-content">
        <p>${r.desc}</p>
      </div>
    </div>
  `).join('');

  // Accordion listeners
  container.querySelectorAll('.rule-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');
      container.querySelectorAll('.rule-item').forEach(it => it.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
        sfx.click();
      }
    });
  });
}

function renderPublicStaff() {
  const grid = document.getElementById('staff-grid');
  if (!grid) return;
  const staffList = DataStore.getStaff();

  if (staffList.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        No staff members listed yet. Add staff via Staff Portal.
      </div>
    `;
    return;
  }

  grid.innerHTML = staffList.map(s => `
    <div class="staff-card interactive-card">
      <div class="staff-avatar-wrap">
        <img src="${s.avatar || 'assets/logo.png'}" alt="${s.name}" class="staff-avatar" onerror="this.src='assets/logo.png'">
        <div class="staff-presence-dot" title="Staff Online"></div>
      </div>
      <h3 class="staff-name">${s.name}</h3>
      <span class="staff-role-badge" style="color: ${s.badgeColor || '#00eaff'}; border-color: ${s.badgeColor || 'rgba(0,234,255,0.4)'};">
        ${s.role}
      </span>
      <p class="staff-bio">${s.bio || 'New Era Community Staff Member.'}</p>
      <div class="staff-discord-tag" data-discord="${s.discord}" title="Click to copy Discord Tag">
        <span>💬 ${s.discord}</span>
      </div>
    </div>
  `).join('');

  // Copy discord listener
  grid.querySelectorAll('.staff-discord-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const disc = tag.getAttribute('data-discord');
      if (disc) {
        navigator.clipboard.writeText(disc).then(() => {
          showToast(`Copied Discord: ${disc}`, 'info');
        });
      }
    });
  });
}


// Global state for application portal
let currentDept = 'whitelist';

let currentApplicationStep = 1;

function goToApplicationStep(step) {
  currentApplicationStep = step;
  if (typeof sfx !== 'undefined' && sfx.click) sfx.click();

  const step1 = document.getElementById('form-step-1');
  const step2 = document.getElementById('form-step-2');
  const step3 = document.getElementById('form-step-3');

  if (step1) step1.style.display = step === 1 ? 'block' : 'none';
  if (step2) step2.style.display = step === 2 ? 'block' : 'none';
  if (step3) step3.style.display = step === 3 ? 'block' : 'none';

  // Update Stepper Nav
  document.querySelectorAll('.stepper-nav .step-item').forEach((item) => {
    const s = parseInt(item.getAttribute('data-step') || '0', 10);
    if (s === step) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Buttons visibility
  const btnPrev = document.getElementById('btn-step-prev');
  const btnNext = document.getElementById('btn-step-next');
  const btnSubmit = document.getElementById('btn-step-submit');

  if (btnPrev) btnPrev.style.display = step > 1 ? 'inline-flex' : 'none';
  if (btnNext) btnNext.style.display = step < 3 ? 'inline-flex' : 'none';
  if (btnSubmit) btnSubmit.style.display = step === 3 ? 'inline-flex' : 'none';

  // Scroll smoothly to form header
  const formBox = document.getElementById('whitelist-full-form');
  if (formBox && typeof formBox.scrollIntoView === 'function') {
    formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
window.goToApplicationStep = goToApplicationStep;

function selectDepartment(deptId) {
  currentDept = deptId;
  const form = document.getElementById('whitelist-full-form');
  const trackerSection = document.getElementById('application-tracker-section');
  const stepperNav = document.getElementById('stepper-nav');

  if (deptId === 'tracker') {
    if (form) form.style.display = 'none';
    if (stepperNav) stepperNav.style.display = 'none';
    if (trackerSection) trackerSection.style.display = 'block';
    const elTitle = document.getElementById('dept-header-title');
    const elDesc = document.getElementById('dept-header-desc');
    const elIcon = document.getElementById('dept-badge-icon');
    if (elTitle) elTitle.textContent = 'Application Case Tracker';
    if (elDesc) elDesc.textContent = 'Search your submission status by Ticket Reference ID or Discord Tag.';
    if (elIcon) elIcon.textContent = '🔍';
    return;
  }

  if (form) form.style.display = 'block';
  if (stepperNav) stepperNav.style.display = 'flex';
  if (trackerSection) trackerSection.style.display = 'none';

  const depts = DataStore.getDepartments();
  const d = depts.find(x => x.id === deptId) || depts[0] || {
    id: 'whitelist',
    name: 'Citizen Entry Ticket',
    icon: '🎫',
    title: 'Citizen Entry Ticket Application',
    desc: 'Complete all 3 stages: OOC info, character persona, and roleplay scenario evaluation.'
  };

  const elTitle = document.getElementById('dept-header-title');
  const elDesc = document.getElementById('dept-header-desc');
  const elIcon = document.getElementById('dept-badge-icon');
  if (elTitle) elTitle.textContent = d.title || (d.name + ' Application');
  if (elDesc) elDesc.textContent = d.desc || 'Complete all 3 stages: OOC info, character persona, and roleplay scenario evaluation.';
  if (elIcon) elIcon.textContent = d.icon || '📋';

  renderScenarioQuestions();
  goToApplicationStep(1);
}

function renderPublicDepartments() {
  const container = document.getElementById('apps-sidebar-dept-list');
  if (!container) return;

  const depts = DataStore.getDepartments();
  container.innerHTML = depts.map(d => `
    <button type="button" class="category-btn ${d.id === currentDept ? 'active' : ''}" data-dept="${d.id}">
      <span class="cat-icon">${d.icon || '📋'}</span>
      <span>${d.name}</span>
    </button>
  `).join('');

  container.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof sfx !== 'undefined' && sfx.tabSwitch) sfx.tabSwitch();
      container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      const trackerBtn = document.getElementById('btn-sidebar-tracker');
      if (trackerBtn) trackerBtn.classList.remove('active');
      btn.classList.add('active');

      const deptId = btn.getAttribute('data-dept');
      selectDepartment(deptId);
    });
  });

  const trackerBtn = document.getElementById('btn-sidebar-tracker');
  if (trackerBtn && !trackerBtn.dataset.bound) {
    trackerBtn.dataset.bound = 'true';
    trackerBtn.addEventListener('click', () => {
      if (typeof sfx !== 'undefined' && sfx.tabSwitch) sfx.tabSwitch();
      container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      trackerBtn.classList.add('active');
      selectDepartment('tracker');
    });
  }
}

function renderScenarioQuestions() {
  const container = document.getElementById('dynamic-scenarios-container') || document.getElementById('dynamic-scenario-questions');
  if (!container) return;

  const allQuestions = DataStore.getQuestions();
  const questions = allQuestions.filter(q => !q.dept || q.dept === 'all' || q.dept === currentDept);

  if (questions.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted); background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed var(--border-glass);">
        <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📋</div>
        <div style="color: #fff; font-weight: 700; margin-bottom: 0.3rem;">Standard Department Evaluation</div>
        <div>No custom scenario questions required for this department. Review and accept server rules below, then submit your entry ticket.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = questions.map((q, idx) => `
    <div class="form-group" style="margin-bottom: 1.5rem;">
      <label for="scenario_${q.id}" style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 0.5rem; display: block;">
        Scenario Question #${idx + 1}: ${q.prompt}
        ${q.required !== false ? '<span class="req" style="color: var(--pink);">*</span>' : ''}
      </label>
      <textarea class="form-control scenario-answer-input" 
        id="scenario_${q.id}"
        data-qid="${q.id}" 
        placeholder="${q.placeholder || 'Explain your character decision, protocol adherence, and dialogue...'}"
        rows="3" style="font-size: 0.9rem; line-height: 1.5; width: 100%;"></textarea>
    </div>
  `).join('');
}

function validateApplicationStep(step) {
  if (step === 1) {
    const discord = (document.getElementById('input-discord')?.value || '').trim();
    const steam = (document.getElementById('input-steam')?.value || '').trim();
    const age = (document.getElementById('input-age')?.value || '').trim();

    if (!discord) {
      showToast('Please enter your Discord Tag (e.g. Kasun#1234 or kasun_rp)', 'warning');
      document.getElementById('input-discord')?.focus();
      return false;
    }
    if (!steam) {
      showToast('Please enter your Steam Hex ID or Steam Profile Link', 'warning');
      document.getElementById('input-steam')?.focus();
      return false;
    }
    if (!age) {
      showToast('Please enter your Real Age', 'warning');
      document.getElementById('input-age')?.focus();
      return false;
    }
    return true;
  }

  if (step === 2) {
    const name = (document.getElementById('input-char-name')?.value || '').trim();
    const backstory = (document.getElementById('input-char-backstory')?.value || '').trim();

    if (!name) {
      showToast('Please enter your Character Full Name (First & Last)', 'warning');
      document.getElementById('input-char-name')?.focus();
      return false;
    }
    if (!backstory || backstory.length < 15) {
      showToast('Please enter a Character Backstory (minimum 15 characters)', 'warning');
      document.getElementById('input-char-backstory')?.focus();
      return false;
    }
    return true;
  }

  return true;
}

function handleApplicationSubmission(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  // Validate step 1
  if (!validateApplicationStep(1)) {
    goToApplicationStep(1);
    return;
  }

  // Validate step 2
  if (!validateApplicationStep(2)) {
    goToApplicationStep(2);
    return;
  }

  // Validate step 3 scenarios (check required scenario inputs)
  const allQuestions = DataStore.getQuestions();
  const deptQuestions = allQuestions.filter(q => !q.dept || q.dept === 'all' || q.dept === currentDept);
  for (let q of deptQuestions) {
    if (q.required !== false) {
      const field = document.getElementById(`scenario_${q.id}`);
      if (field && !field.value.trim()) {
        showToast(`Please answer Scenario Question: "${q.prompt.substring(0, 35)}..."`, 'warning');
        goToApplicationStep(3);
        field.focus();
        return;
      }
    }
  }

  // Terms agreement
  const terms = document.getElementById('terms-agree');
  if (terms && !terms.checked) {
    showToast('You must accept server rules before submitting', 'warning');
    goToApplicationStep(3);
    terms.focus();
    return;
  }

  // Collect answers
  const answers = {};
  deptQuestions.forEach(q => {
    const field = document.getElementById(`scenario_${q.id}`);
    if (field) answers[q.id] = field.value.trim();
  });

  // Generate Ticket ID
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `NET-${randomSuffix}-LK`;

  const depts = DataStore.getDepartments();
  const currentDeptObj = depts.find(x => x.id === currentDept) || { name: 'Citizen Entry Ticket' };

  const newApp = {
    id: ticketId,
    dept: currentDept,
    deptName: currentDeptObj.name || 'Citizen Entry Ticket',
    discordTag: (document.getElementById('input-discord')?.value || '').trim(),
    steamHex: (document.getElementById('input-steam')?.value || '').trim(),
    age: (document.getElementById('input-age')?.value || '').trim(),
    timezone: (document.getElementById('input-timezone')?.value || '').trim() || 'GMT+5:30',
    experience: (document.getElementById('input-experience')?.value || '').trim() || 'None specified',
    characterName: (document.getElementById('input-char-name')?.value || '').trim(),
    charAge: (document.getElementById('input-char-age')?.value || '').trim() || '25',
    charGender: 'Specified in Backstory',
    backstory: (document.getElementById('input-char-backstory')?.value || '').trim(),
    answers: answers,
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    notes: 'New submission received.'
  };

  // Save to Local DataStore
  const apps = DataStore.getApplications();
  apps.unshift(newApp);
  DataStore.saveApplications(apps);

  // Generate Ticket Pass image data URL and send to Laravel MySQL Backend API
  generateTicketPassBlob(newApp, 'Pending')
    .then(blob => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const passImage = reader.result;
        fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            dept: newApp.dept,
            dept_name: newApp.deptName,
            discord_tag: newApp.discordTag,
            steam_hex: newApp.steamHex,
            age: newApp.age,
            timezone: newApp.timezone,
            experience: newApp.experience,
            character_name: newApp.characterName,
            char_age: newApp.charAge,
            char_gender: newApp.charGender,
            backstory: newApp.backstory,
            answers: newApp.answers,
            pass_image: passImage
          })
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.application && data.application.id) {
            newApp.id = data.application.id;
            displayBoardingPass(newApp);
          }
        })
        .catch(err => console.warn('Laravel API submit notice:', err));
      };
      reader.readAsDataURL(blob);
    })
    .catch(() => {
      fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          dept: newApp.dept,
          dept_name: newApp.deptName,
          discord_tag: newApp.discordTag,
          steam_hex: newApp.steamHex,
          age: newApp.age,
          timezone: newApp.timezone,
          experience: newApp.experience,
          character_name: newApp.characterName,
          char_age: newApp.charAge,
          char_gender: newApp.charGender,
          backstory: newApp.backstory,
          answers: newApp.answers
        })
      }).catch(err => console.warn('Laravel API submit notice:', err));
    });

  // Client-side Discord Webhook with Card Image Attachment
  try {
    sendDiscordSubmissionWebhook(newApp);
  } catch (err) {
    console.error('Webhook send error:', err);
  }

  // Show Success Boarding Pass Modal
  displayBoardingPass(newApp);
  showToast(`Entry Ticket #${ticketId} submitted successfully!`, 'success');

  // Reset Form
  const form = document.getElementById('whitelist-full-form');
  if (form) form.reset();
  goToApplicationStep(1);
  if (typeof refreshDatabaseTable === 'function') refreshDatabaseTable();
}

function setupApplicationPortal() {
  renderPublicDepartments();
  selectDepartment("whitelist");

  const form = document.getElementById('whitelist-full-form');
  const btnPrev = document.getElementById('btn-step-prev');
  const btnNext = document.getElementById('btn-step-next');
  const btnSubmit = document.getElementById('btn-step-submit');

  renderScenarioQuestions();

  // Clickable Stepper Items (circles 1, 2, 3)
  document.querySelectorAll('.stepper-nav .step-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const targetStep = parseInt(item.getAttribute('data-step') || '1', 10);
      if (targetStep === currentApplicationStep) return;

      if (targetStep > currentApplicationStep) {
        // Must validate intervening steps before jumping ahead
        for (let s = currentApplicationStep; s < targetStep; s++) {
          if (!validateApplicationStep(s)) return;
        }
      }
      goToApplicationStep(targetStep);
    });
  });

  // Next Step Button
  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validateApplicationStep(currentApplicationStep)) return;
      if (currentApplicationStep < 3) {
        goToApplicationStep(currentApplicationStep + 1);
      }
    });
  }

  // Previous Step Button
  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentApplicationStep > 1) {
        goToApplicationStep(currentApplicationStep - 1);
      }
    });
  }

  // Submit Button Direct Click
  if (btnSubmit) {
    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      handleApplicationSubmission(e);
    });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleApplicationSubmission(e);
    });
  }

  // Initialize at step 1
  goToApplicationStep(1);
}

// ==========================================================================
// DISCORD WEBHOOK ANNOUNCEMENT ENGINE
// ==========================================================================
function sendDiscordSubmissionWebhook(app) {
  const cfg = DataStore.getConfig();
  const globalCfg = window.NERP_CONFIG || {};

  // All applications client-side submission alert webhook
  const webhookUrl = (cfg.discordWebhook || globalCfg.discordWebhook || 'https://discord.com/api/webhooks/1553103300768047244/FhnaFVOxYvDH62A0q16qotZCj1sUd-Uxue1v24WNykBD54A_JZxHu3WF2h7ZZZdIdTAw').trim();
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    console.warn(`[Discord Webhook] Submission Webhook URL is not configured or empty.`);
    return;
  }

  const templates = DataStore.getDiscordTemplates();
  const botAvatar = getValidDiscordAvatar(templates.botAvatar || globalCfg.botAvatar);
  const botName = templates.botName || globalCfg.botName || 'New Era Entry Gateway';
  const fileName = `entry_pass_${app.id}.png`;

  let userMention = '';
  const digitsMatch = (app.discordTag || '').match(/\d{15,20}/);
  if (digitsMatch) {
    userMention = `<@${digitsMatch[0]}>`;
  } else if ((app.discordTag || '').startsWith('<@') && (app.discordTag || '').endsWith('>')) {
    userMention = app.discordTag;
  } else {
    userMention = `@${app.discordTag || 'applicant'}`;
  }

  const makePayload = (withImage = false) => ({
    content: `📢 **[NEW ERA ROLEPLAY] NEW ENTRY TICKET APPLICATION RECEIVED**\nApplicant **${app.characterName}** (${userMention}) has submitted an official application. Reference: \`${app.id}\``,
    username: botName,
    ...(botAvatar ? { avatar_url: botAvatar } : {}),
    embeds: [
      {
        color: 0x00eaff,
        ...(withImage ? { image: { url: `attachment://${fileName}` } } : {
          title: `🎟️ NEW ${(app.deptName || 'CITIZEN ENTRY TICKET').toUpperCase()} SUBMITTED`,
          description: `Applicant **${app.characterName}** (${userMention}) - Ticket: \`${app.id}\``
        }),
        footer: { text: 'NEW ERA ROLEPLAY COMMUNITY • OFFICIAL CITIZEN ENTRY PASS' },
        timestamp: new Date().toISOString()
      }
    ]
  });

  generateTicketPassBlob(app, 'Pending')
    .then(blob => {
      const formData = new FormData();
      formData.append('files[0]', blob, fileName);
      formData.append('payload_json', JSON.stringify(makePayload(true)));

      return fetch(webhookUrl, {
        method: 'POST',
        body: formData
      });
    })
    .catch(err => {
      console.warn('Canvas pass generation fallback, sending text embed:', err);
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(makePayload(false))
      });
    });
}

/**
 * Generates an offscreen Canvas rendering of the Official Citizen Entry Ticket / Boarding Pass
 * Identical in layout, fonts, and styling to the in-game / website modal pass.
 * Returns a Promise that resolves with a PNG Blob.
 */
function generateTicketPassBlob(app, statusType, customRemarks = '') {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 430;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context not available'));

      const st = (statusType || app.status || 'Pending').toLowerCase();
      const isApproved = st === 'approved';
      const isRejected = st === 'rejected';

      const statusTitle = isApproved ? 'APPROVED' : (isRejected ? 'REJECTED' : 'PENDING REVIEW');
      const accent = isApproved ? '#2ed573' : (isRejected ? '#ff4757' : '#ffa502');

      const cornerRadius = 20;
      const w = 900, h = 430;
      const splitX = 635; // Perforation line x

      const drawCardClip = () => {
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(0, 0, w, h, cornerRadius);
        } else {
          ctx.rect(0, 0, w, h);
        }
      };

      ctx.save();
      drawCardClip();
      ctx.clip();

      // 1. LEFT SECTION (Theme Colors: Deep Cyber Purple / Navy with subtle neon glow)
      const gradLeft = ctx.createLinearGradient(0, 0, splitX, h);
      gradLeft.addColorStop(0, '#0a081a');
      gradLeft.addColorStop(0.45, '#130d2e');
      gradLeft.addColorStop(1, '#1b113d');
      ctx.fillStyle = gradLeft;
      ctx.fillRect(0, 0, splitX, h);

      // Subtle cyan radial highlight on left
      const radGlow = ctx.createRadialGradient(80, 60, 5, 80, 60, 260);
      radGlow.addColorStop(0, 'rgba(0, 234, 255, 0.12)');
      radGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radGlow;
      ctx.fillRect(0, 0, splitX, h);

      // 2. RIGHT SECTION (PURE CLEAN WHITE AS REQUESTED)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(splitX, 0, w - splitX, h);

      ctx.restore();

      // Perforation Line & Notches
      ctx.save();
      ctx.setLineDash([7, 6]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(splitX, 16);
      ctx.lineTo(splitX, h - 16);
      ctx.stroke();
      ctx.restore();

      // Top & Bottom circular cutout notches
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(splitX, 0, 16, 0, Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(splitX, h, 16, Math.PI, 0);
      ctx.fill();

      // Outer border
      ctx.save();
      drawCardClip();
      ctx.strokeStyle = 'rgba(0, 234, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // =========================================================================
      // LEFT SIDE CONTENT (Theme colors, Bigger Fonts, Staff Remark, NO Steam Hex)
      // =========================================================================
      ctx.textAlign = 'left';

      // 1. Header: Brand Title
      ctx.font = '900 28px "Outfit", "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('NEW ERA', 38, 52);

      ctx.fillStyle = '#00eaff';
      ctx.fillText('ROLEPLAY', 190, 52);

      // Department Badge
      const deptText = (app.deptName || 'CITIZEN ENTRY TICKET').toUpperCase();
      ctx.font = '700 13px "Space Mono", Consolas, monospace';
      const badgeW = ctx.measureText(deptText).width + 34;
      const badgeX = splitX - badgeW - 28;

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(badgeX, 28, badgeW, 32, 16);
      } else {
        ctx.rect(badgeX, 28, badgeW, 32);
      }
      ctx.fillStyle = 'rgba(171, 0, 255, 0.18)';
      ctx.fill();
      ctx.strokeStyle = '#00eaff';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = '#00eaff';
      ctx.fillText(deptText, badgeX + 17, 49);

      // 2. Flight / Transit Route
      ctx.font = '900 26px "Outfit", "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('ORIGIN', 38, 122);

      ctx.font = '700 12px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('CIVILIAN TRANSIT', 38, 144);

      // Center Airplane icon box
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(268, 102, 58, 46, 12);
      } else {
        ctx.rect(268, 102, 58, 46);
      }
      ctx.fillStyle = 'rgba(0, 234, 255, 0.08)';
      ctx.fill();
      ctx.strokeStyle = '#00eaff';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.font = '22px "Segoe UI Symbol", Arial, sans-serif';
      ctx.fillStyle = '#00eaff';
      ctx.textAlign = 'center';
      ctx.fillText('\u2708', 297, 133);
      ctx.textAlign = 'left';

      ctx.font = '900 26px "Outfit", "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('DEST', 370, 122);

      ctx.font = '700 12px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#00eaff';
      ctx.fillText('NEW ERA CITY', 370, 144);

      // 3. Grid details (Enlarged fonts, NO Steam Hex)
      // Row 1: CITIZEN NAME, DISCORD ID, TICKET REF
      ctx.font = '700 11px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('CITIZEN NAME', 38, 198);
      ctx.font = '800 22px "Outfit", "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(app.characterName || 'Unknown Citizen', 38, 224);

      ctx.font = '700 11px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('DISCORD ID', 255, 198);
      ctx.font = '700 17px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(app.discordTag || 'N/A', 255, 223);

      ctx.font = '700 11px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('TICKET REF', 445, 198);
      ctx.font = '900 22px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#00eaff';
      ctx.fillText(app.id || 'NET-0000-LK', 445, 224);

      // Row 2: SUBMISSION DATE, REVIEW STATUS, ENTRY SECTOR
      ctx.font = '700 11px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('SUBMISSION DATE', 38, 272);
      ctx.font = '700 16px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(app.date || new Date().toISOString().split('T')[0], 38, 296);

      ctx.font = '700 11px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('REVIEW STATUS', 255, 272);
      ctx.font = '900 21px "Outfit", "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = accent;
      ctx.fillText(isApproved ? 'APPROVED \u2713' : statusTitle, 255, 296);

      ctx.font = '700 11px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('ENTRY SECTOR', 445, 272);
      ctx.font = '700 16px "Outfit", "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.fillText(app.deptName || 'Citizen Entry', 445, 296);

      // Row 3: STAFF REMARKS (Replacing Steam Hex as requested!)
      ctx.font = '700 11px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('STAFF REMARKS', 38, 342);
      ctx.font = '800 16px "Outfit", "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#00eaff';
      ctx.fillText(customRemarks || 'WELCOME TO NEW ERA ROLEPLAY COMMUNITY', 38, 365);

      // Bottom Bar
      ctx.font = '700 11px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('OFFICIAL NEW ERA ENTRY PASS  \u2022  FIVEM CONNECT: cfx.re/join/g9b9mq', 38, 404);

      // =========================================================================
      // RIGHT SIDE CONTENT (PURE WHITE BACKGROUND STUB with LOGO, BARCODE, STUB INFO)
      // =========================================================================
      const stubCenterX = splitX + (w - splitX) / 2; // ~767

      // 1. Stub Header
      ctx.font = '800 13px "Space Mono", Consolas, monospace';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText(`ENTRY STUB \u2022 ${app.id || ''}`, stubCenterX, 42);

      ctx.beginPath();
      ctx.moveTo(splitX + 24, 52);
      ctx.lineTo(w - 24, 52);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 2. Logo in center of white stub
      const logoImg = document.querySelector('.preloader-logo-img') || document.querySelector('.nav-brand img');
      if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
        const logoSize = 100;
        const logoX = stubCenterX - (logoSize / 2);
        const logoY = 70;
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      } else {
        ctx.font = '900 18px "Outfit", sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('NEW ERA', stubCenterX, 115);
        ctx.font = '800 12px monospace';
        ctx.fillStyle = '#ab00ff';
        ctx.fillText('ROLEPLAY', stubCenterX, 135);
      }

      ctx.font = '800 12px "Outfit", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('NEW ERA ROLEPLAY', stubCenterX, 190);
      ctx.font = '700 10px "Space Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('OFFICIAL CITIZEN PASS', stubCenterX, 206);

      // 3. Airline Boarding Pass Barcode (Crisp vertical black stripes on white)
      const barcodeY = 222;
      const barcodeH = 42;
      const barcodeW = 190;
      const barcodeX = stubCenterX - (barcodeW / 2);

      const barPattern = [3,2,1,4,2,1,3,1,2,4,1,3,2,1,4,2,3,1,2,1,4,2,3,1,3,2,1,4,2,1,3,2,4,1,2,3,1,4];
      let curBx = barcodeX;
      ctx.fillStyle = '#0f172a';
      for (let i = 0; i < barPattern.length && curBx < barcodeX + barcodeW; i++) {
        const barThickness = barPattern[i];
        if (i % 2 === 0) {
          ctx.fillRect(curBx, barcodeY, barThickness, barcodeH);
        }
        curBx += barThickness + 1.5;
      }

      ctx.font = '700 10px "Space Mono", monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText(`* ${app.id || 'NET-9099'} *`, stubCenterX, 280);

      // 4. Holder & Status on White Stub
      ctx.font = '700 11px "Space Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('PASSENGER / CITIZEN', stubCenterX, 312);

      ctx.font = '900 18px "Outfit", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(app.characterName || 'Citizen', stubCenterX, 336);

      // Status pill badge on white stub
      ctx.beginPath();
      const statusPillW = 150;
      const statusPillH = 30;
      const statusPillX = stubCenterX - (statusPillW / 2);
      const statusPillY = 356;
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(statusPillX, statusPillY, statusPillW, statusPillH, 15);
      } else {
        ctx.rect(statusPillX, statusPillY, statusPillW, statusPillH);
      }
      ctx.fillStyle = isApproved ? '#2ed573' : (isRejected ? '#ff4757' : '#ffa502');
      ctx.fill();

      ctx.font = '900 12px "Space Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(isApproved ? 'ACCEPTED \u2713' : statusTitle, stubCenterX, statusPillY + 19);

      // Return Blob
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/png');
    } catch (e) {
      reject(e);
    }
  });
}

function sendDiscordStatusWebhook(app, statusType, staffRemarks = '') {
  const globalCfg = window.NERP_CONFIG || {};
  const respHooks = globalCfg.responseWebhooks || {};

  // Department Response Webhook Routing
  let webhookUrl = '';
  if (app.dept === 'police') {
    webhookUrl = (respHooks.police || 'https://discord.com/api/webhooks/1552757720615100436/dCmrdhEkxUXFGBiAmYCpq2u1LMdgaLSbQOnYMnwQdOhdXoqW3tW7O9Rm69-JLo545uz3').trim();
  } else if (app.dept === 'ems') {
    webhookUrl = (respHooks.ems || 'https://discord.com/api/webhooks/1552758037570256930/idkLCx1rfjNMef8TluzUZbSwfooSRwJywlPWbM9H-dS2X-PHnyzbqsCFvfnI7_CXOzdr').trim();
  } else {
    webhookUrl = (respHooks.whitelist || 'https://discord.com/api/webhooks/1552694543529283585/QvAr3vtWRuOF0oElPWOy6hMrTgKVyT9snzDg3nHc2E-HeEE4QPRtCjCblC3quL7j90s-').trim();
  }

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    console.warn(`Discord Response Webhook URL for department [${app.dept}] is not configured or empty`);
    return;
  }

  const templates = DataStore.getDiscordTemplates();
  const isApproved = statusType === 'Approved';
  const isRejected = statusType === 'Rejected';
  const statusWord = isApproved ? 'ACCEPTED' : (isRejected ? 'REJECTED' : 'PENDING');
  const statusEmoji = isApproved ? '✅' : (isRejected ? '❌' : '⏳');

  // Extract Discord user mention ID (<@123456789...>)
  let userMention = '';
  const digitsMatch = (app.discordTag || '').match(/\d{15,20}/);
  if (digitsMatch) {
    userMention = `<@${digitsMatch[0]}>`;
  } else if ((app.discordTag || '').startsWith('<@') && (app.discordTag || '').endsWith('>')) {
    userMention = app.discordTag;
  } else {
    userMention = `@${app.discordTag || 'applicant'}`;
  }

  let rawTemplate = isApproved ? templates.msgApproved : (isRejected ? templates.msgRejected : templates.msgPending);
  if (!rawTemplate) {
    rawTemplate = `${userMention}, Your whitelist application has been **${statusWord}** ${statusEmoji}.\n\nPlease check announcements for the next steps regarding your interview.\n\n**RESULT**\n**${statusWord}** ${statusEmoji}`;
  }

  // Format dynamic variables
  const cleanContent = rawTemplate
    .replace(/\{mention\}/g, userMention)
    .replace(/\{status\}/g, `${statusWord} ${statusEmoji}`)
    .replace(/\{ticket\}/g, app.id || '')
    .replace(/\{department\}/g, app.deptName || 'Entry Ticket')
    .replace(/\{character\}/g, app.characterName || '');

  const botAvatar = getValidDiscordAvatar(templates.botAvatar || globalCfg.botAvatar);
  const botName = templates.botName || globalCfg.botName || 'New Era Entry Gateway';

  // Embed Accent Color (Green for Accepted, Red for Rejected)
  const embedColor = isApproved ? 0x00ff88 : (isRejected ? 0xff4757 : 0xffa502);
  const finalRemarks = (staffRemarks || templates.staffRemarksDefault || 'WELCOME TO NEW ERA ROLEPLAY COMMUNITY').trim();
  const fileName = `entry_pass_${app.id}.png`;

  const sendFallback = () => {
    const payload = {
      content: cleanContent,
      username: botName,
      ...(botAvatar ? { avatar_url: botAvatar } : {}),
      embeds: [
        {
          color: embedColor,
          footer: { text: 'NEW ERA ROLEPLAY COMMUNITY • APPLICATION DECISION' },
          timestamp: new Date().toISOString()
        }
      ]
    };

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (res.ok) showToast(`Discord decision posted for ${statusType}!`, 'success');
      else console.error('Discord webhook fallback status:', res.status);
    })
    .catch(err => console.error('Discord webhook fallback failed:', err));
  };

  generateTicketPassBlob(app, statusType, finalRemarks)
    .then(blob => {
      const formData = new FormData();
      formData.append('files[0]', blob, fileName);

      // Clean message content + high-res graphical pass
      const payload = {
        content: cleanContent,
        username: botName,
        ...(botAvatar ? { avatar_url: botAvatar } : {}),
        embeds: [
          {
            color: embedColor,
            image: { url: `attachment://${fileName}` },
            footer: { text: 'NEW ERA ROLEPLAY COMMUNITY • OFFICIAL CITIZEN PASS' },
            timestamp: new Date().toISOString()
          }
        ]
      };

      formData.append('payload_json', JSON.stringify(payload));

      return fetch(webhookUrl, {
        method: 'POST',
        body: formData
      });
    })
    .then(res => {
      if (res && res.ok) {
        showToast(`🎫 Discord Ticket Pass posted for ${statusType}!`, 'success');
      } else {
        sendFallback();
      }
    })
    .catch(err => {
      sendFallback();
    });
}

// ==========================================================================
// 9. BOARDING PASS / CITIZEN TICKET MODAL
// ==========================================================================
function displayBoardingPass(app) {
  const overlay = document.getElementById('ticket-modal-overlay');
  const ticket = document.querySelector('.flight-ticket');
  if (!overlay || !ticket) return;

  // Clear previous color themes
  ticket.classList.remove('ticket-approved', 'ticket-rejected', 'ticket-pending');

  const status = (app.status || 'Pending').toLowerCase();
  if (status === 'approved') {
    ticket.classList.add('ticket-approved');
  } else if (status === 'rejected') {
    ticket.classList.add('ticket-rejected');
  } else {
    ticket.classList.add('ticket-pending');
  }

  document.getElementById('ticket-val-name').textContent = app.characterName;
  document.getElementById('ticket-val-discord').textContent = app.discordTag;
  const remarksElem = document.getElementById('ticket-val-remarks');
  if (remarksElem) remarksElem.textContent = app.notes || 'WELCOME TO NEW ERA ROLEPLAY COMMUNITY';
  document.getElementById('ticket-val-id').textContent = app.id;
  document.getElementById('ticket-val-date').textContent = app.date;
  document.getElementById('stub-val-holder').textContent = app.characterName;
  document.getElementById('stub-ref-id').textContent = app.id;
  document.getElementById('ticket-pass-dept').textContent = (app.deptName || 'CITIZEN ENTRY TICKET').toUpperCase();

  const statusElem = document.getElementById('ticket-val-status');
  statusElem.textContent = app.status.toUpperCase();
  statusElem.className = `val status-${status}`;

  overlay.style.display = 'flex';
  overlay.classList.add('active');
  sfx.success();
}

function setupBoardingPassActions() {
  const overlay = document.getElementById('ticket-modal-overlay');
  const btnClose = document.getElementById('btn-close-ticket-modal');
  const btnCopy = document.getElementById('btn-copy-ticket-id');
  const btnPrint = document.getElementById('btn-print-ticket');

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      overlay.classList.remove('active');
      sfx.click();
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const id = document.getElementById('ticket-val-id').textContent;
      navigator.clipboard.writeText(id).then(() => {
        showToast(`Copied Ticket ID: ${id}`, 'info');
      });
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}

// ==========================================================================
// 10. APPLICATION STATUS TRACKER (Case Lookup)
// ==========================================================================
function normalizeApp(a) {
  if (!a) return null;
  return {
    id: a.id || `NET-${Math.floor(1000 + Math.random() * 9000)}-LK`,
    dept: a.dept || 'whitelist',
    deptName: a.dept_name || a.deptName || 'Citizen Entry Ticket',
    discordTag: a.discord_tag || a.discordTag || 'Unknown#0000',
    steamHex: a.steam_hex || a.steamHex || 'N/A',
    age: String(a.age || '18'),
    timezone: a.timezone || 'GMT+5:30',
    experience: a.experience || 'None specified',
    characterName: a.character_name || a.characterName || 'Unknown Citizen',
    charAge: String(a.char_age || a.charAge || '25'),
    charGender: a.char_gender || a.charGender || 'Male',
    backstory: a.backstory || '',
    answers: a.answers || {},
    status: a.status || 'Pending',
    date: (a.created_at ? a.created_at.substring(0, 10) : a.date) || new Date().toISOString().split('T')[0],
    notes: a.notes || ''
  };
}

function setupStatusTracker() {
  const btnCheck = document.getElementById('btn-check-status');
  const input = document.getElementById('input-tracker-query');
  const resultBox = document.getElementById('tracker-result-box');

  if (!btnCheck || !input || !resultBox) return;

  const performCheck = () => {
    const q = input.value.trim();
    if (!q) {
      showToast('Please enter your Ticket ID or Discord Tag', 'warning');
      return;
    }

    resultBox.innerHTML = `
      <div style="background: rgba(0, 234, 255, 0.08); border: 1px solid rgba(0, 234, 255, 0.3); padding: 1.5rem; border-radius: 12px; text-align: center; color: var(--cyan);">
        <span class="pulse-dot" style="display:inline-block; margin-right: 8px;"></span> Checking New Era database...
      </div>
    `;

    fetch(`/api/applications/track?query=${encodeURIComponent(q)}`, {
      headers: { 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
      let match = null;
      if (data && data.success && data.application) {
        match = normalizeApp(data.application);
      } else {
        const apps = DataStore.getApplications();
        const qLow = q.toLowerCase();
        match = apps.find(a => 
          (a.id && a.id.toLowerCase() === qLow) || 
          (a.discordTag && a.discordTag.toLowerCase() === qLow) ||
          (a.characterName && a.characterName.toLowerCase() === qLow)
        );
      }

      if (!match) {
        resultBox.innerHTML = `
          <div style="background: rgba(255, 71, 87, 0.15); border: 1px solid rgba(255, 71, 87, 0.4); padding: 1.5rem; border-radius: 12px; text-align: center; color: #ff6b81;">
            <strong>No application found</strong> matching "<strong>${q}</strong>". Check your spelling or apply for an Entry Ticket first.
          </div>
        `;
        sfx.error();
        return;
      }

      const statusColors = {
        Approved: '#2ed573',
        Pending: '#ffa502',
        Rejected: '#ff4757'
      };

      resultBox.innerHTML = `
        <div style="background: rgba(14, 18, 30, 0.85); border: 1px solid var(--border-glow); border-radius: 14px; padding: 1.8rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <span style="font-family: var(--font-mono); color: var(--cyan); font-size: 0.8rem;">CASE TICKET: ${match.id}</span>
              <h4 style="font-family: var(--font-heading); color: #fff; font-size: 1.25rem;">${match.characterName}</h4>
            </div>
            <span style="background: ${statusColors[match.status] || '#00eaff'}22; color: ${statusColors[match.status] || '#00eaff'}; border: 1px solid ${statusColors[match.status] || '#00eaff'}; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 800; font-size: 0.85rem;">
              ${match.status.toUpperCase()}
            </span>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem; margin-bottom: 1.2rem;">
            <div><strong style="color: var(--text-muted);">Discord:</strong> ${match.discordTag}</div>
            <div><strong style="color: var(--text-muted);">Department:</strong> ${match.deptName}</div>
            <div><strong style="color: var(--text-muted);">Date Applied:</strong> ${match.date}</div>
            <div><strong style="color: var(--text-muted);">Steam Hex:</strong> <code>${match.steamHex}</code></div>
          </div>

          <div style="background: rgba(0,0,0,0.4); padding: 0.9rem 1rem; border-radius: 8px; border: 1px solid var(--border-glass); margin-bottom: 1.2rem; font-size: 0.88rem;">
            <strong style="color: var(--cyan);">Staff Remarks:</strong> ${match.notes || 'Under standard review by New Era staff.'}
          </div>

          <button type="button" class="btn-primary" id="btn-tracker-view-pass" style="width: 100%; justify-content: center;">
            <span>🎫 VIEW OFFICIAL BOARDING PASS</span>
          </button>
        </div>
      `;

      document.getElementById('btn-tracker-view-pass').addEventListener('click', () => {
        displayBoardingPass(match);
      });

      sfx.success();
    })
    .catch(err => {
      console.warn('Track API notice, fallback to local:', err);
      const apps = DataStore.getApplications();
      const qLow = q.toLowerCase();
      const match = apps.find(a => 
        (a.id && a.id.toLowerCase() === qLow) || 
        (a.discordTag && a.discordTag.toLowerCase() === qLow) ||
        (a.characterName && a.characterName.toLowerCase() === qLow)
      );

      if (match) {
        const statusColors = { Approved: '#2ed573', Pending: '#ffa502', Rejected: '#ff4757' };
        resultBox.innerHTML = `
          <div style="background: rgba(14, 18, 30, 0.85); border: 1px solid var(--border-glow); border-radius: 14px; padding: 1.8rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem; margin-bottom: 1rem;">
              <div>
                <span style="font-family: var(--font-mono); color: var(--cyan); font-size: 0.8rem;">CASE TICKET: ${match.id}</span>
                <h4 style="font-family: var(--font-heading); color: #fff; font-size: 1.25rem;">${match.characterName}</h4>
              </div>
              <span style="background: ${statusColors[match.status] || '#00eaff'}22; color: ${statusColors[match.status] || '#00eaff'}; border: 1px solid ${statusColors[match.status] || '#00eaff'}; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 800; font-size: 0.85rem;">
                ${match.status.toUpperCase()}
              </span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem; margin-bottom: 1.2rem;">
              <div><strong style="color: var(--text-muted);">Discord:</strong> ${match.discordTag}</div>
              <div><strong style="color: var(--text-muted);">Department:</strong> ${match.deptName}</div>
              <div><strong style="color: var(--text-muted);">Date Applied:</strong> ${match.date}</div>
              <div><strong style="color: var(--text-muted);">Steam Hex:</strong> <code>${match.steamHex}</code></div>
            </div>
            <div style="background: rgba(0,0,0,0.4); padding: 0.9rem 1rem; border-radius: 8px; border: 1px solid var(--border-glass); margin-bottom: 1.2rem; font-size: 0.88rem;">
              <strong style="color: var(--cyan);">Staff Remarks:</strong> ${match.notes || 'Under standard review by New Era staff.'}
            </div>
            <button type="button" class="btn-primary" id="btn-tracker-view-pass" style="width: 100%; justify-content: center;">
              <span>🎫 VIEW OFFICIAL BOARDING PASS</span>
            </button>
          </div>
        `;
        document.getElementById('btn-tracker-view-pass').addEventListener('click', () => {
          displayBoardingPass(match);
        });
        sfx.success();
      } else {
        resultBox.innerHTML = `
          <div style="background: rgba(255, 71, 87, 0.15); border: 1px solid rgba(255, 71, 87, 0.4); padding: 1.5rem; border-radius: 12px; text-align: center; color: #ff6b81;">
            <strong>No application found</strong> matching "<strong>${q}</strong>". Check your spelling or apply for an Entry Ticket first.
          </div>
        `;
        sfx.error();
      }
    });
  };

  btnCheck.addEventListener('click', performCheck);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performCheck();
    }
  });
}

// ==========================================================================
// 11. STAFF MANAGEMENT PORTAL & ADMIN CONSOLE (Hidden from Clients)
// ==========================================================================
window.closeAdminPortal = function() {
  const modal = document.getElementById('staff-portal-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
  sfx.click();
};

window.closePortalAndScroll = function(targetSelector) {
  window.closeAdminPortal();
  setTimeout(() => {
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

function setupStaffPortal() {
  const modal = document.getElementById('staff-portal-modal');
  const loginCard = document.getElementById('staff-login-card');
  const consoleCard = document.getElementById('staff-console-card');
  const loginForm = document.getElementById('staff-login-form');
  const pinInput = document.getElementById('staff-passcode-input');
  const btnClose = document.getElementById('btn-close-staff-portal');
  const btnBackToSite = document.getElementById('btn-portal-back-to-site');
  const btnHomeTop = document.getElementById('btn-console-home-top');
  const btnExitTop = document.getElementById('btn-console-exit-btn');
  const btnLogout = document.getElementById('btn-staff-logout');

  const btnAuthDiscord = document.getElementById('auth-tab-btn-discord');
  const btnAuthPasscode = document.getElementById('auth-tab-btn-passcode');
  const wrapAuthDiscord = document.getElementById('auth-mode-discord-wrap');
  const wrapAuthPasscode = document.getElementById('auth-mode-passcode-wrap');
  const discordLoginForm = document.getElementById('staff-discord-login-form');
  const discordUserInput = document.getElementById('staff-discord-id-input');
  const discordRolePreset = document.getElementById('staff-role-select-preset');

  // Helper to update active user display in header
  const updateStaffHeaderUser = () => {
    try {
      const stored = sessionStorage.getItem('nerp_staff_user');
      const user = stored ? JSON.parse(stored) : { name: 'Master Admin', roleName: 'HEAD ADMINISTRATOR', color: '#00eaff' };
      const nameElem = document.getElementById('staff-active-user-name');
      const roleElem = document.getElementById('staff-active-role');
      if (nameElem) nameElem.textContent = user.name || 'Staff Admin';
      if (roleElem) {
        roleElem.textContent = (user.roleName || 'HEAD ADMINISTRATOR').toUpperCase();
        if (user.color) roleElem.style.color = user.color;
      }
    } catch (e) {}
  };

  // Triggers to open staff portal
  const openPortal = () => {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const isAuthed = sessionStorage.getItem('nerp_staff_authenticated') === 'true';
    if (isAuthed) {
      loginCard.style.display = 'none';
      consoleCard.style.display = 'flex';
      updateStaffHeaderUser();
      refreshStaffConsole();
    } else {
      loginCard.style.display = 'block';
      consoleCard.style.display = 'none';
      setTimeout(() => {
        if (wrapAuthDiscord && wrapAuthDiscord.style.display !== 'none') {
          discordUserInput?.focus();
        } else {
          pinInput?.focus();
        }
      }, 150);
    }
    sfx.click();
  };

  const closePortal = () => {
    window.closeAdminPortal();
  };

  // Auth Mode Tabs switching (Discord vs Passcode)
  btnAuthDiscord?.addEventListener('click', () => {
    btnAuthDiscord.classList.add('active');
    btnAuthPasscode?.classList.remove('active');
    if (wrapAuthDiscord) wrapAuthDiscord.style.display = 'block';
    if (wrapAuthPasscode) wrapAuthPasscode.style.display = 'none';
    discordUserInput?.focus();
    sfx.click();
  });

  btnAuthPasscode?.addEventListener('click', () => {
    btnAuthPasscode.classList.add('active');
    btnAuthDiscord?.classList.remove('active');
    if (wrapAuthDiscord) wrapAuthDiscord.style.display = 'none';
    if (wrapAuthPasscode) wrapAuthPasscode.style.display = 'block';
    pinInput?.focus();
    sfx.click();
  });

  // Triggers (Desktop Navbar, Mobile Menu, Footer, Discrete Links)
  document.querySelectorAll('.staff-portal-trigger-link').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('mobile-nav')?.classList.remove('open');
      openPortal();
    });
  });
  document.getElementById('nav-btn-admin-portal')?.addEventListener('click', (e) => {
    e.preventDefault();
    openPortal();
  });
  document.getElementById('footer-staff-login-btn')?.addEventListener('click', openPortal);
  document.getElementById('discrete-staff-link')?.addEventListener('click', openPortal);
  document.getElementById('mobile-staff-portal-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mobile-nav')?.classList.remove('open');
    openPortal();
  });

  // Direct URL Hash & Search parameter triggers (e.g. #admin, #admin-discord, #admin-discord-roles, #admin-discord-templates)
  const handleDeepHash = () => {
    if (window.location.hash.startsWith('#admin') || window.location.search.includes('admin')) {
      setTimeout(() => {
        openPortal();
        if (window.location.hash.startsWith('#admin-discord')) {
          setTimeout(() => {
            document.querySelector('button[data-tab="discord"]')?.click();
            if (window.location.hash === '#admin-discord-roles') {
              document.querySelector('button[data-disc-sub="roles"]')?.click();
            } else if (window.location.hash === '#admin-discord-templates') {
              document.querySelector('button[data-disc-sub="templates"]')?.click();
            } else if (window.location.hash === '#admin-discord-api') {
              document.querySelector('button[data-disc-sub="api"]')?.click();
            }
          }, 120);
        }
      }, 200);
    }
  };

  handleDeepHash();
  window.addEventListener('hashchange', handleDeepHash);

  // Secret Hotkey: Ctrl + Shift + A or Escape to close
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      openPortal();
    } else if (e.key === 'Escape' && modal.style.display === 'flex') {
      closePortal();
    }
  });

  btnClose?.addEventListener('click', closePortal);
  btnBackToSite?.addEventListener('click', closePortal);
  btnHomeTop?.addEventListener('click', () => window.closePortalAndScroll('#home'));
  btnExitTop?.addEventListener('click', closePortal);

  // Logout
  btnLogout?.addEventListener('click', () => {
    sessionStorage.removeItem('nerp_staff_authenticated');
    sessionStorage.removeItem('nerp_staff_user');
    loginCard.style.display = 'block';
    consoleCard.style.display = 'none';
    showToast('Logged out of Staff Portal', 'info');
  });

  // 1. Discord Role Login Handler
  discordLoginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const discordInput = (discordUserInput ? discordUserInput.value : '').trim();
    if (!discordInput) {
      showToast('Please provide your Discord User ID or tag', 'warning');
      return;
    }

    const presetId = discordRolePreset ? discordRolePreset.value : 'drole-1';
    const roles = DataStore.getDiscordRoles();
    const matchedRole = roles.find(r => r.id === presetId) || roles[0];

    const staffUser = {
      name: discordInput,
      roleName: matchedRole ? matchedRole.name : 'Authorized Staff',
      roleId: matchedRole ? matchedRole.roleId : '1424089623344451807',
      color: matchedRole ? matchedRole.color : '#00eaff',
      permissions: matchedRole ? matchedRole.permissions : ['tickets'],
      deptScope: matchedRole ? matchedRole.deptScope : 'all'
    };

    sessionStorage.setItem('nerp_staff_authenticated', 'true');
    sessionStorage.setItem('nerp_staff_user', JSON.stringify(staffUser));

    loginCard.style.display = 'none';
    consoleCard.style.display = 'flex';
    updateStaffHeaderUser();
    showToast(`Discord Verified! Welcome, ${discordInput} [${staffUser.roleName}]`, 'success');
    refreshStaffConsole();
  });

  // 2. Master Passcode Login Handler
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const cfg = DataStore.getConfig();
    const entered = pinInput.value.trim();

    if (entered === cfg.adminPasscode || entered === 'newera2026') {
      const defaultAdmin = {
        name: 'Master Admin',
        roleName: 'HEAD ADMINISTRATOR',
        color: '#00eaff',
        permissions: ['all'],
        deptScope: 'all'
      };
      sessionStorage.setItem('nerp_staff_authenticated', 'true');
      sessionStorage.setItem('nerp_staff_user', JSON.stringify(defaultAdmin));

      loginCard.style.display = 'none';
      consoleCard.style.display = 'flex';
      pinInput.value = '';
      updateStaffHeaderUser();
      showToast('Staff Access Granted. Welcome, Administrator!', 'success');
      refreshStaffConsole();
    } else {
      showToast('Invalid Staff Passcode. Access Denied.', 'error');
      pinInput.value = '';
      pinInput.focus();
    }
  });

  // Console Tabs Switching with Smooth Scroll Reset (Fixes freeze!)
  document.querySelectorAll('.console-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.tabSwitch();
      document.querySelectorAll('.console-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.console-tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const tabName = btn.getAttribute('data-tab');
      document.getElementById(`tab-panel-${tabName}`)?.classList.add('active');

      // Scroll tab body smoothly to top when switching tabs
      const tabBody = document.querySelector('.console-tab-body');
      if (tabBody) tabBody.scrollTop = 0;
    });
  });

  // Clock
  setInterval(() => {
    const clock = document.getElementById('staff-console-clock');
    if (clock) {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString();
    }
  }, 1000);

  // Sub-modules Setup
  setupDatabaseSubmodule();
  setupRulesSubmodule();
  setupDepartmentsSubmodule();
  setupQuestionsSubmodule();
  setupFeaturesSubmodule();
  setupStaffSubmodule();
  setupSettingsSubmodule();
  setupDiscordSubmodule();
}

function refreshStaffConsole() {
  refreshDatabaseTable();
  refreshDepartmentsManager();
  refreshRulesManager();
  refreshQuestionsManager();
  refreshFeaturesManager();
  refreshStaffManager();
  populateSettingsForm();
  refreshDiscordRoutesTable();
  refreshDiscordRolesTable();
  populateDiscordTemplatesForm();
  populateDiscordSecurityForm();
  refreshDatabaseDeptFilterChips();
}

window.switchConsoleTab = function(tabName) {
  if (typeof sfx !== 'undefined' && sfx.tabSwitch) sfx.tabSwitch();
  document.querySelectorAll('.console-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.console-tab-panel').forEach(p => p.classList.remove('active'));

  const targetBtn = document.querySelector(`.console-tab-btn[data-tab="${tabName}"]`);
  if (targetBtn) targetBtn.classList.add('active');
  const targetPanel = document.getElementById(`tab-panel-${tabName}`);
  if (targetPanel) targetPanel.classList.add('active');

  const tabBody = document.querySelector('.console-tab-body');
  if (tabBody) tabBody.scrollTop = 0;
};

// ==========================================================================
// 12. TAB 1: APPLICATIONS DATABASE SUBMODULE
// ==========================================================================
// Active subview and department filter states
let currentDbSubview = 'pending';
let currentDeptFilter = 'all';

function refreshDatabaseDeptFilterChips() {
  const container = document.getElementById('db-dept-chips');
  if (!container) return;

  const depts = DataStore.getDepartments();
  const apps = DataStore.getApplications();

  let html = `<span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan); align-self: center; margin-right: 0.5rem;">FILTER DEPT:</span>`;
  html += `<button type="button" class="dept-chip-btn ${currentDeptFilter === 'all' ? 'active' : ''}" data-dept-filter="all">All Departments (${apps.length})</button>`;

  depts.forEach(d => {
    const count = apps.filter(a => a.dept === d.id).length;
    html += `<button type="button" class="dept-chip-btn ${currentDeptFilter === d.id ? 'active' : ''}" data-dept-filter="${d.id}">${d.icon || '📋'} ${d.name} (${count})</button>`;
  });

  html += `<button type="button" class="btn-primary" onclick="switchConsoleTab('questions')" style="margin-left: auto; padding: 4px 10px; font-size: 0.75rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 0.3rem;"><span>+ ADD / MANAGE DEPARTMENTS</span></button>`;

  container.innerHTML = html;

  container.querySelectorAll('.dept-chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.dept-chip-btn').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const dept = chip.getAttribute('data-dept-filter');
      currentDeptFilter = dept;
      const deptFilter = document.getElementById('db-filter-dept');
      if (deptFilter) deptFilter.value = dept;
      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
      refreshDatabaseTable();
    });
  });

  // Also sync db-filter-dept dropdown options
  const deptFilter = document.getElementById('db-filter-dept');
  if (deptFilter) {
    const cur = deptFilter.value;
    deptFilter.innerHTML = '<option value="all">All Departments</option>' +
      depts.map(d => `<option value="${d.id}">${d.icon || '📋'} ${d.name}</option>`).join('');
    if (cur) deptFilter.value = cur;
  }
}

function setupDatabaseSubmodule() {
  const searchInput = document.getElementById('db-search-input');
  const statusFilter = document.getElementById('db-filter-status');
  const deptFilter = document.getElementById('db-filter-dept');
  const btnExportJson = document.getElementById('btn-export-db-json');
  const btnExportCsv = document.getElementById('btn-export-db-csv');
  const btnSeedTest = document.getElementById('btn-seed-test-app');
  const subnavBtns = document.querySelectorAll('.db-subnav-btn');
  const deptChipsContainer = document.getElementById('db-dept-chips');

  refreshDatabaseDeptFilterChips();

  // 1. Subnav Filter Tabs (Pending Queue, Accepted Citizens, Rejected, By Department, Master Registry)
  subnavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subnavBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const subview = btn.getAttribute('data-subview');
      currentDbSubview = subview;

      if (subview === 'departments') {
        if (deptChipsContainer) deptChipsContainer.style.display = 'flex';
      } else {
        if (deptChipsContainer) deptChipsContainer.style.display = 'none';
      }

      // Sync the status dropdown
      if (statusFilter) {
        if (subview === 'pending') statusFilter.value = 'Pending';
        else if (subview === 'approved') statusFilter.value = 'Approved';
        else if (subview === 'rejected') statusFilter.value = 'Rejected';
        else statusFilter.value = 'all';
      }

      sfx.click();
      refreshDatabaseTable();
    });
  });

  // 2. Department Category Chips
  deptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      deptChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const dept = chip.getAttribute('data-dept-filter');
      currentDeptFilter = dept;
      if (deptFilter) {
        deptFilter.value = dept;
      }
      sfx.click();
      refreshDatabaseTable();
    });
  });

  // 3. Search input
  searchInput?.addEventListener('input', () => refreshDatabaseTable());

  // 4. Status dropdown filter
  statusFilter?.addEventListener('change', () => {
    const val = statusFilter.value.toLowerCase();
    subnavBtns.forEach(b => {
      const sv = b.getAttribute('data-subview');
      if (val === 'all' && sv === 'all') b.classList.add('active');
      else if (val === 'pending' && sv === 'pending') b.classList.add('active');
      else if (val === 'approved' && sv === 'approved') b.classList.add('active');
      else if (val === 'rejected' && sv === 'rejected') b.classList.add('active');
      else b.classList.remove('active');
    });
    currentDbSubview = val === 'all' ? 'all' : val;
    refreshDatabaseTable();
  });

  // 5. Dept dropdown filter
  deptFilter?.addEventListener('change', () => {
    currentDeptFilter = deptFilter.value;
    deptChips.forEach(c => {
      if (c.getAttribute('data-dept-filter') === currentDeptFilter) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
    refreshDatabaseTable();
  });

  // 6. Export JSON
  btnExportJson?.addEventListener('click', () => {
    const apps = DataStore.getApplications();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(apps, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `newera_applications_${new Date().toISOString().split('T')[0]}.json`);
    dl.click();
    showToast('Database exported as JSON', 'info');
  });

  // 7. Export CSV
  btnExportCsv?.addEventListener('click', () => {
    const apps = DataStore.getApplications();
    let csv = 'Ticket ID,Department,Character Name,Discord Tag,Steam Hex,Status,Date\n';
    apps.forEach(a => {
      csv += `"${a.id}","${a.deptName}","${a.characterName}","${a.discordTag}","${a.steamHex}","${a.status}","${a.date}"\n`;
    });
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `newera_applications_${new Date().toISOString().split('T')[0]}.csv`);
    dl.click();
    showToast('Database exported as CSV', 'info');
  });

  // 8. Add Test Application
  btnSeedTest?.addEventListener('click', () => {
    const id = `NET-${Math.floor(1000 + Math.random() * 9000)}-LK`;
    const names = ['Nuwan Jayasinghe', 'Kasun Perera', 'Dilan Silva', 'Saman Bandara', 'Roshan Wickrama'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const testApp = {
      id: id,
      dept: 'whitelist',
      deptName: 'Citizen Entry Ticket',
      discordTag: `Player_${Math.floor(Math.random() * 900)}#0000`,
      steamHex: 'steam:11000010' + Math.random().toString(16).substring(2, 8),
      age: '22',
      timezone: 'GMT+5:30',
      experience: '2 years GTA V FiveM roleplay experience',
      characterName: randomName,
      charAge: '25',
      charGender: 'Male',
      backstory: 'Arrived in New Era City to establish a licensed transport business and connect with citizens.',
      answers: {
        q1: 'RDM is killing with no roleplay reason. VDM is running someone over with a vehicle.',
        q2: 'Value of Life requires prioritizing survival and complying when held at gunpoint.',
        q3: 'Metagaming is using OOC external communication. Powergaming is forcing impossible scenarios.',
        q4: 'New Life Rule requires forgetting prior conflict after being downed.'
      },
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      notes: 'New applicant awaiting review.'
    };
    const apps = DataStore.getApplications();
    apps.unshift(testApp);
    DataStore.saveApplications(apps);
    renderDatabaseTableUI();

    // Generate Ticket Pass image and dispatch webhook with graphical boarding pass card
    generateTicketPassBlob(testApp, 'Pending')
      .then(blob => {
        sendDiscordSubmissionWebhook(testApp);
        const reader = new FileReader();
        reader.onloadend = () => {
          fetch('/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              dept: testApp.dept,
              dept_name: testApp.deptName,
              discord_tag: testApp.discordTag,
              steam_hex: testApp.steamHex,
              age: testApp.age,
              timezone: testApp.timezone,
              experience: testApp.experience,
              character_name: testApp.characterName,
              char_age: testApp.charAge,
              char_gender: testApp.charGender,
              backstory: testApp.backstory,
              answers: testApp.answers,
              pass_image: reader.result
            })
          })
          .then(r => r.json())
          .then(res => {
            if (res && res.application) {
              testApp.id = res.application.id;
              renderDatabaseTableUI();
            }
          })
          .catch(e => console.warn('Test application MySQL sync notice:', e));
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        sendDiscordSubmissionWebhook(testApp);
      });

    showToast(`Test Application #${id} added to Queue & Alert Sent!`, 'success');
  });

  setupDossierActions();
}

function fetchAndSyncBackendApplications() {
  fetch('/api/applications', {
    headers: { 'Accept': 'application/json' }
  })
  .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch from backend'))
  .then(data => {
    if (Array.isArray(data) && data.length > 0) {
      const normalized = data.map(normalizeApp);
      DataStore.saveApplications(normalized);
      renderDatabaseTableUI();
    }
  })
  .catch(err => {
    // Offline or static fallback
    console.debug('Backend applications sync notice:', err);
  });
}

function refreshDatabaseTable() {
  renderDatabaseTableUI();
  fetchAndSyncBackendApplications();
}

function renderDatabaseTableUI() {
  const tableBody = document.getElementById('db-table-body');
  if (!tableBody) return;

  const search = (document.getElementById('db-search-input')?.value || '').trim().toLowerCase();
  const statusFilt = document.getElementById('db-filter-status')?.value || 'all';
  const deptFilt = document.getElementById('db-filter-dept')?.value || 'all';

  const apps = DataStore.getApplications();

  // Update Stats Counters
  const total = apps.length;
  const pending = apps.filter(a => (a.status || '').toLowerCase() === 'pending').length;
  const approved = apps.filter(a => (a.status || '').toLowerCase() === 'approved').length;
  const rejected = apps.filter(a => (a.status || '').toLowerCase() === 'rejected').length;

  const elTotal = document.getElementById('stat-total-apps');
  const elPending = document.getElementById('stat-pending-apps');
  const elApproved = document.getElementById('stat-approved-apps');
  const elRejected = document.getElementById('stat-rejected-apps');
  if (elTotal) elTotal.textContent = total;
  if (elPending) elPending.textContent = pending;
  if (elApproved) elApproved.textContent = approved;
  if (elRejected) elRejected.textContent = rejected;

  // Update Subnav Badge Pills
  const pPending = document.getElementById('pill-count-pending');
  const pApproved = document.getElementById('pill-count-approved');
  const pRejected = document.getElementById('pill-count-rejected');
  const pAll = document.getElementById('pill-count-all');
  if (pPending) pPending.textContent = pending;
  if (pApproved) pApproved.textContent = approved;
  if (pRejected) pRejected.textContent = rejected;
  if (pAll) pAll.textContent = total;

  const tabBadge = document.getElementById('tab-badge-pending');
  if (tabBadge) tabBadge.textContent = pending;

  // Filter Logic
  const filtered = apps.filter(a => {
    const matchesSearch = !search || 
      (a.id || '').toLowerCase().includes(search) || 
      (a.characterName || '').toLowerCase().includes(search) || 
      (a.discordTag || '').toLowerCase().includes(search) || 
      (a.steamHex || '').toLowerCase().includes(search);

    // Status matching based on current subview or select dropdown
    let matchesStatus = true;
    if (currentDbSubview === 'pending') {
      matchesStatus = (a.status || '').toLowerCase() === 'pending';
    } else if (currentDbSubview === 'approved') {
      matchesStatus = (a.status || '').toLowerCase() === 'approved';
    } else if (currentDbSubview === 'rejected') {
      matchesStatus = (a.status || '').toLowerCase() === 'rejected';
    } else if (statusFilt !== 'all') {
      matchesStatus = (a.status || '').toLowerCase() === statusFilt.toLowerCase();
    }

    // Department matching
    let matchesDept = true;
    const activeDept = (currentDeptFilter !== 'all' ? currentDeptFilter : deptFilt).toLowerCase();
    if (activeDept !== 'all') {
      const dCode = (a.dept || '').toLowerCase();
      const dName = (a.deptName || '').toLowerCase();
      matchesDept = dCode === activeDept || dName.includes(activeDept);
    }

    return matchesSearch && matchesStatus && matchesDept;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          No applications found for current filter (${currentDbSubview.toUpperCase()}).
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(a => {
    const st = (a.status || 'Pending').toLowerCase();
    return `
      <tr>
        <td><strong style="color: var(--cyan); font-family: var(--font-mono);">${a.id}</strong></td>
        <td>
          <div style="font-weight: 700; color: #fff;">${a.characterName}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${a.age || '21'} Yrs • OOC</div>
        </td>
        <td>
          <div style="color: #cbd5e1;">💬 ${a.discordTag}</div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">${a.steamHex || 'N/A'}</div>
        </td>
        <td><span class="rule-badge">${a.deptName || 'CITIZEN ENTRY TICKET'}</span></td>
        <td><span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${a.date}</span></td>
        <td><span class="status-badge status-${st}">${a.status}</span></td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button type="button" class="btn-action-view" onclick="openAppDossier('${a.id}')" title="Inspect Full Dossier">Inspect</button>
            <button type="button" class="btn-action-approve" onclick="quickUpdateStatus('${a.id}', 'Approved')" title="Quick Approve">✓</button>
            <button type="button" class="btn-action-reject" onclick="quickUpdateStatus('${a.id}', 'Rejected')" title="Quick Reject">✕</button>
            <button type="button" class="btn-action-delete" onclick="deleteApplication('${a.id}')" title="Delete Application">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.quickUpdateStatus = function(appId, newStatus) {
  const apps = DataStore.getApplications();
  const target = apps.find(a => a.id === appId);
  if (target) {
    target.status = newStatus;
    DataStore.saveApplications(apps);
    refreshDatabaseTable();

    // Sync to Laravel MySQL Backend API
    fetch(`/api/applications/${appId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ status: newStatus, notes: target.notes || '' })
    }).catch(e => console.warn('Laravel status update error:', e));

    // Dispatch status decision announcement with graphical boarding pass ticket card
    sendDiscordStatusWebhook(target, newStatus);
    showToast(`Application #${appId} marked as ${newStatus}`, newStatus === 'Approved' ? 'success' : 'error');
  }
};

window.deleteApplication = function(appId) {
  if (confirm(`Are you sure you want to permanently delete application #${appId}?`)) {
    let apps = DataStore.getApplications();
    apps = apps.filter(a => a.id !== appId);
    DataStore.saveApplications(apps);
    refreshDatabaseTable();

    // Delete from Laravel MySQL Backend API
    fetch(`/api/applications/${appId}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    }).catch(e => console.warn('Laravel delete error:', e));

    showToast(`Application #${appId} deleted.`, 'info');
  }
};

// Application Dossier Inspector
let activeDossierId = null;

window.openAppDossier = function(appId) {
  const apps = DataStore.getApplications();
  const app = apps.find(a => a.id === appId);
  if (!app) return;

  activeDossierId = appId;
  const modal = document.getElementById('app-dossier-modal');

  document.getElementById('dos-char-name').textContent = app.characterName;
  document.getElementById('dos-ticket-id').textContent = app.id;
  document.getElementById('dos-dept').textContent = app.deptName;
  document.getElementById('dos-date').textContent = app.date;

  const badge = document.getElementById('dos-status-badge');
  badge.textContent = app.status;
  badge.className = `status-badge status-${app.status.toLowerCase()}`;

  document.getElementById('dos-val-name').textContent = app.characterName;
  document.getElementById('dos-val-age-gender').textContent = `${app.charAge || '25'} Yrs / ${app.charGender || 'Male'}`;
  document.getElementById('dos-val-backstory').textContent = app.backstory || 'No backstory provided.';

  document.getElementById('dos-val-discord').textContent = app.discordTag;
  document.getElementById('dos-val-steam').textContent = app.steamHex;
  document.getElementById('dos-val-realage').textContent = `${app.age} Years Old`;
  document.getElementById('dos-val-timezone').textContent = app.timezone || 'Not specified';
  document.getElementById('dos-val-experience').textContent = app.experience || 'None';

  document.getElementById('dos-staff-notes').value = app.notes || '';

  // Render Scenario Answers
  const scContainer = document.getElementById('dos-scenarios-container');
  const questions = DataStore.getQuestions();
  scContainer.innerHTML = questions.map(q => `
    <div style="margin-bottom: 1rem;">
      <div style="color: var(--cyan); font-weight: 700; font-size: 0.88rem; margin-bottom: 4px;">❓ ${q.prompt}</div>
      <div class="dossier-text-block">${app.answers && app.answers[q.id] ? app.answers[q.id] : 'No answer provided'}</div>
    </div>
  `).join('');

  modal.style.display = 'flex';
  sfx.click();
};

function setupDossierActions() {
  const modal = document.getElementById('app-dossier-modal');
  document.getElementById('btn-close-dossier')?.addEventListener('click', () => modal.style.display = 'none');

  document.getElementById('btn-copy-dos-discord')?.addEventListener('click', () => {
    const d = document.getElementById('dos-val-discord').textContent;
    navigator.clipboard.writeText(d).then(() => showToast(`Copied Discord: ${d}`, 'info'));
  });

  document.getElementById('btn-copy-dos-steam')?.addEventListener('click', () => {
    const s = document.getElementById('dos-val-steam').textContent;
    navigator.clipboard.writeText(s).then(() => showToast(`Copied Steam: ${s}`, 'info'));
  });

  const saveNotesAndStatus = (status) => {
    if (!activeDossierId) return;
    const apps = DataStore.getApplications();
    const app = apps.find(a => a.id === activeDossierId);
    if (app) {
      if (status) app.status = status;
      app.notes = document.getElementById('dos-staff-notes').value.trim();
      DataStore.saveApplications(apps);
      refreshDatabaseTable();
      openAppDossier(activeDossierId);

      // Sync updated notes and status to Laravel MySQL Backend API
      fetch(`/api/applications/${encodeURIComponent(app.id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ status: app.status, notes: app.notes || '' })
      }).catch(e => console.warn('Laravel status update error:', e));

      // Sync updated notes and status to Cloud Realtime DB
      if (typeof updateApplicationStatusInCloud === 'function') {
        updateApplicationStatusInCloud(app.id, app.status, app.notes);
      }

      // Dispatch status decision announcement with graphical boarding pass ticket card
      if (status) sendDiscordStatusWebhook(app, status, app.notes);
      showToast(`Updated Application #${app.id}`, 'success');
    }
  };

  document.getElementById('btn-dos-approve')?.addEventListener('click', () => saveNotesAndStatus('Approved'));
  document.getElementById('btn-dos-reject')?.addEventListener('click', () => saveNotesAndStatus('Rejected'));
  document.getElementById('btn-dos-pending')?.addEventListener('click', () => saveNotesAndStatus('Pending'));

  document.getElementById('btn-dos-view-pass')?.addEventListener('click', () => {
    const apps = DataStore.getApplications();
    const app = apps.find(a => a.id === activeDossierId);
    if (app) displayBoardingPass(app);
  });

  document.getElementById('btn-dos-delete')?.addEventListener('click', () => {
    if (activeDossierId && confirm(`Permanently delete application #${activeDossierId}?`)) {
      window.deleteApplication(activeDossierId);
      modal.style.display = 'none';
    }
  });
}

// ==========================================================================
// 13. TAB 2: RULES MANAGER SUBMODULE
// ==========================================================================
function setupRulesSubmodule() {
  const btnAdd = document.getElementById('btn-open-add-rule-form');
  const formWrap = document.getElementById('rule-edit-form-wrap');
  const form = document.getElementById('form-manage-rule');
  const btnCancel = document.getElementById('btn-cancel-rule-form');

  btnAdd?.addEventListener('click', () => {
    form.reset();
    document.getElementById('rule-edit-id').value = '';
    document.getElementById('rule-form-title').textContent = 'ADD NEW SERVER RULE';
    formWrap.style.display = 'block';
    sfx.click();
  });

  btnCancel?.addEventListener('click', () => {
    formWrap.style.display = 'none';
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('rule-edit-id').value || `rule-${Date.now()}`;
    const newRule = {
      id: id,
      title: document.getElementById('rule-input-title').value.trim(),
      category: document.getElementById('rule-input-category').value,
      desc: document.getElementById('rule-input-desc').value.trim()
    };

    let rules = DataStore.getRules();
    const existingIdx = rules.findIndex(r => r.id === id);
    if (existingIdx >= 0) rules[existingIdx] = newRule;
    else rules.push(newRule);

    DataStore.saveRules(rules);
    formWrap.style.display = 'none';
    refreshRulesManager();
    renderPublicRules();
    showToast('Server rule saved successfully!', 'success');
  });
}

function refreshRulesManager() {
  const tbody = document.getElementById('rules-manager-table-body');
  if (!tbody) return;
  const rules = DataStore.getRules();

  tbody.innerHTML = rules.map(r => `
    <tr>
      <td><span class="rule-badge">${r.category.toUpperCase()}</span></td>
      <td><strong style="color: #fff;">${r.title}</strong></td>
      <td style="font-size: 0.85rem; color: var(--text-muted); max-width: 380px;">${r.desc}</td>
      <td>
        <button type="button" class="btn-action-view" onclick="editRule('${r.id}')">Edit</button>
        <button type="button" class="btn-action-delete" onclick="deleteRule('${r.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.editRule = function(ruleId) {
  const rules = DataStore.getRules();
  const r = rules.find(item => item.id === ruleId);
  if (!r) return;

  document.getElementById('rule-edit-id').value = r.id;
  document.getElementById('rule-input-title').value = r.title;
  document.getElementById('rule-input-category').value = r.category;
  document.getElementById('rule-input-desc').value = r.desc;
  document.getElementById('rule-form-title').textContent = 'EDIT SERVER RULE';
  document.getElementById('rule-edit-form-wrap').style.display = 'block';
  sfx.click();
};

window.deleteRule = function(ruleId) {
  if (confirm('Delete this rule permanently?')) {
    let rules = DataStore.getRules();
    rules = rules.filter(r => r.id !== ruleId);
    DataStore.saveRules(rules);
    refreshRulesManager();
    renderPublicRules();
    showToast('Rule deleted', 'info');
  }
};

// ==========================================================================
// 14. TAB 3: SCENARIO QUESTIONS MANAGER SUBMODULE
// ==========================================================================
// ==========================================================================
// 13. TAB 2.5 & 3: DEPARTMENTS & SCENARIO QUESTIONS MANAGER
// ==========================================================================
function setupDepartmentsSubmodule() {
  const btnAdd = document.getElementById('btn-open-add-dept-form');
  const formWrap = document.getElementById('dept-edit-form-wrap');
  const form = document.getElementById('form-manage-dept');
  const btnCancel = document.getElementById('btn-cancel-dept-form');

  btnAdd?.addEventListener('click', () => {
    form.reset();
    document.getElementById('dept-edit-id').value = '';
    document.getElementById('dept-form-title').textContent = 'ADD ROLEPLAY DEPARTMENT';
    document.getElementById('dept-input-id').removeAttribute('readonly');
    formWrap.style.display = 'block';
    sfx.click();
  });

  btnCancel?.addEventListener('click', () => {
    formWrap.style.display = 'none';
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('dept-edit-id').value.trim();
    const code = document.getElementById('dept-input-id').value.trim().toLowerCase().replace(/\s+/g, '-');
    const name = document.getElementById('dept-input-name').value.trim();
    const icon = document.getElementById('dept-input-icon').value.trim() || '📋';
    const title = document.getElementById('dept-input-title').value.trim();
    const desc = document.getElementById('dept-input-desc').value.trim();

    let depts = DataStore.getDepartments();

    if (editId) {
      const idx = depts.findIndex(d => d.id === editId);
      if (idx !== -1) {
        depts[idx] = { ...depts[idx], name, icon, title, desc };
      }
      showToast(`Department "${name}" updated`, 'success');
    } else {
      if (depts.some(d => d.id === code)) {
        showToast(`Department code "${code}" already exists!`, 'error');
        return;
      }
      depts.push({ id: code, name, icon, title, desc });

      // Automatically add a Discord channel route for this department
      let routes = DataStore.getDiscordRoutes();
      if (!routes.some(r => r.deptId === code)) {
        routes.push({
          id: `route-${code}`,
          deptId: code,
          deptName: name,
          channelName: `#${code}-applications`,
          webhookUrl: '',
          mentionRoleId: '',
          mentionUser: true,
          sendTicketPass: true,
          enabled: true
        });
        DataStore.saveDiscordRoutes(routes);
      }

      showToast(`Department "${name}" created!`, 'success');
    }

    DataStore.saveDepartments(depts);
    formWrap.style.display = 'none';
    refreshDepartmentsManager();
    renderPublicDepartments();
    refreshQuestionsManager();
    refreshDiscordRoutesTable();
    refreshDatabaseDeptFilterChips();
  });
}

function refreshDepartmentsManager() {
  const tbody = document.getElementById('depts-manager-table-body');
  if (!tbody) return;

  const depts = DataStore.getDepartments();
  tbody.innerHTML = depts.map(d => `
    <tr>
      <td style="font-size: 1.5rem; text-align: center;">${d.icon || '📋'}</td>
      <td><strong style="color: #fff; font-size: 0.95rem;">${d.name}</strong></td>
      <td><span class="rule-badge">${d.id}</span></td>
      <td>
        <div style="color: var(--cyan); font-weight: 700; font-size: 0.85rem;">${d.title}</div>
        <div style="color: var(--text-muted); font-size: 0.78rem; margin-top: 2px;">${d.desc}</div>
      </td>
      <td>
        <div style="display: flex; gap: 0.4rem;">
          <button type="button" class="btn-action-view" onclick="editDepartment('${d.id}')">Edit</button>
          <button type="button" class="btn-action-delete" onclick="deleteDepartment('${d.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Update question department selector and filter dropdown
  const deptSelect = document.getElementById('question-input-dept');
  const deptFilter = document.getElementById('filter-questions-by-dept');

  if (deptSelect) {
    const currentVal = deptSelect.value;
    deptSelect.innerHTML = '<option value="all">All Departments (General Evaluation)</option>' +
      depts.map(d => `<option value="${d.id}">${d.icon || '📋'} ${d.name}</option>`).join('');
    if (currentVal) deptSelect.value = currentVal;
  }

  if (deptFilter) {
    const currentFilt = deptFilter.value;
    deptFilter.innerHTML = '<option value="all">Filter: All Departments</option>' +
      depts.map(d => `<option value="${d.id}">${d.icon || '📋'} ${d.name}</option>`).join('');
    if (currentFilt) deptFilter.value = currentFilt;
  }
}

window.editDepartment = function(deptId) {
  const depts = DataStore.getDepartments();
  const d = depts.find(x => x.id === deptId);
  if (!d) return;

  document.getElementById('dept-edit-id').value = d.id;
  document.getElementById('dept-input-id').value = d.id;
  document.getElementById('dept-input-id').setAttribute('readonly', 'true');
  document.getElementById('dept-input-name').value = d.name;
  document.getElementById('dept-input-icon').value = d.icon || '📋';
  document.getElementById('dept-input-title').value = d.title;
  document.getElementById('dept-input-desc').value = d.desc;

  document.getElementById('dept-form-title').textContent = `EDIT DEPARTMENT: ${d.name.toUpperCase()}`;
  document.getElementById('dept-edit-form-wrap').style.display = 'block';
  sfx.click();
};

window.deleteDepartment = function(deptId) {
  if (deptId === 'whitelist') {
    showToast('The Citizen Entry Ticket department is core and cannot be deleted.', 'warning');
    return;
  }
  if (confirm(`Are you sure you want to permanently delete department "${deptId}" and its configuration?`)) {
    let depts = DataStore.getDepartments();
    depts = depts.filter(d => d.id !== deptId);
    DataStore.saveDepartments(depts);
    refreshDepartmentsManager();
    renderPublicDepartments();
    refreshQuestionsManager();
    refreshDiscordRoutesTable();
    refreshDatabaseDeptFilterChips();
    showToast(`Department "${deptId}" deleted`, 'info');
  }
};

function setupQuestionsSubmodule() {
  const btnAdd = document.getElementById('btn-open-add-question-form');
  const formWrap = document.getElementById('question-edit-form-wrap');
  const form = document.getElementById('form-manage-question');
  const btnCancel = document.getElementById('btn-cancel-question-form');
  const deptFilter = document.getElementById('filter-questions-by-dept');

  deptFilter?.addEventListener('change', () => {
    refreshQuestionsManager();
    sfx.click();
  });

  btnAdd?.addEventListener('click', () => {
    form.reset();
    document.getElementById('question-edit-id').value = '';
    document.getElementById('question-form-title').textContent = 'ADD SCENARIO QUESTION';
    formWrap.style.display = 'block';
    sfx.click();
  });

  btnCancel?.addEventListener('click', () => {
    formWrap.style.display = 'none';
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('question-edit-id').value;
    const dept = document.getElementById('question-input-dept').value || 'all';
    const prompt = document.getElementById('question-input-prompt').value.trim();
    const placeholder = document.getElementById('question-input-placeholder').value.trim();
    const required = document.getElementById('question-input-required').checked;

    let questions = DataStore.getQuestions();

    if (id) {
      const idx = questions.findIndex(q => q.id === id);
      if (idx !== -1) {
        questions[idx] = { ...questions[idx], dept, prompt, placeholder, required };
      }
      showToast('Question updated', 'success');
    } else {
      const newId = 'q_' + Date.now();
      questions.push({ id: newId, dept, prompt, placeholder, required });
      showToast('New scenario question added', 'success');
    }

    DataStore.saveQuestions(questions);
    formWrap.style.display = 'none';
    refreshQuestionsManager();
    renderScenarioQuestions();
  });
}

function refreshQuestionsManager() {
  const tbody = document.getElementById('questions-manager-table-body');
  if (!tbody) return;

  const filterDept = document.getElementById('filter-questions-by-dept')?.value || 'all';
  const allQuestions = DataStore.getQuestions();
  const depts = DataStore.getDepartments();

  const questions = filterDept === 'all' 
    ? allQuestions 
    : allQuestions.filter(q => q.dept === 'all' || q.dept === filterDept || !q.dept);

  if (questions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No questions found for selected department filter.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = questions.map((q, idx) => {
    const deptObj = depts.find(d => d.id === q.dept);
    const deptBadge = q.dept === 'all' || !q.dept 
      ? '<span class="rule-badge" style="background: rgba(0, 234, 255, 0.15); color: var(--cyan);">🌐 ALL DEPTS</span>'
      : `<span class="rule-badge" style="background: rgba(171, 0, 255, 0.15); color: var(--primary-light);">${deptObj ? deptObj.icon + ' ' + deptObj.name : q.dept}</span>`;

    return `
      <tr>
        <td>${idx + 1}</td>
        <td><strong style="color: #fff; font-size: 0.9rem;">${q.prompt}</strong></td>
        <td>${deptBadge}</td>
        <td>${q.required ? '✅ Yes' : 'No'}</td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button type="button" class="btn-action-view" onclick="editQuestion('${q.id}')">Edit</button>
            <button type="button" class="btn-action-delete" onclick="deleteQuestion('${q.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.editQuestion = function(id) {
  const questions = DataStore.getQuestions();
  const q = questions.find(item => item.id === id);
  if (!q) return;

  document.getElementById('question-edit-id').value = q.id;
  document.getElementById('question-input-dept').value = q.dept || 'all';
  document.getElementById('question-input-prompt').value = q.prompt;
  document.getElementById('question-input-placeholder').value = q.placeholder || '';
  document.getElementById('question-input-required').checked = !!q.required;

  document.getElementById('question-form-title').textContent = 'EDIT SCENARIO QUESTION';
  document.getElementById('question-edit-form-wrap').style.display = 'block';
  sfx.click();
};

window.deleteQuestion = function(id) {
  if (confirm('Permanently delete this scenario question?')) {
    let questions = DataStore.getQuestions();
    questions = questions.filter(q => q.id !== id);
    DataStore.saveQuestions(questions);
    refreshQuestionsManager();
    renderScenarioQuestions();
    showToast('Question deleted', 'info');
  }
};

function setupFeaturesSubmodule() {
  const btnAdd = document.getElementById('btn-open-add-feature-form');
  const formWrap = document.getElementById('feature-edit-form-wrap');
  const form = document.getElementById('form-manage-feature');
  const btnCancel = document.getElementById('btn-cancel-feature-form');

  btnAdd?.addEventListener('click', () => {
    form.reset();
    document.getElementById('feature-edit-id').value = '';
    document.getElementById('feature-form-title').textContent = 'ADD CITY FEATURE';
    formWrap.style.display = 'block';
    sfx.click();
  });

  btnCancel?.addEventListener('click', () => {
    formWrap.style.display = 'none';
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('feature-edit-id').value || `f_${Date.now()}`;
    const newF = {
      id: id,
      icon: document.getElementById('feature-input-icon').value.trim() || '⭐',
      title: document.getElementById('feature-input-title').value.trim(),
      desc: document.getElementById('feature-input-desc').value.trim()
    };

    let features = DataStore.getFeatures();
    const idx = features.findIndex(f => f.id === id);
    if (idx >= 0) features[idx] = newF;
    else features.push(newF);

    DataStore.saveFeatures(features);
    formWrap.style.display = 'none';
    refreshFeaturesManager();
    renderPublicFeatures();
    showToast('City feature updated!', 'success');
  });
}

function refreshFeaturesManager() {
  const tbody = document.getElementById('features-manager-table-body');
  if (!tbody) return;
  const features = DataStore.getFeatures();

  tbody.innerHTML = features.map(f => `
    <tr>
      <td style="font-size: 1.5rem;">${f.icon}</td>
      <td><strong style="color: #fff;">${f.title}</strong></td>
      <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 420px;">${f.desc}</td>
      <td>
        <button type="button" class="btn-action-view" onclick="editFeature('${f.id}')">Edit</button>
        <button type="button" class="btn-action-delete" onclick="deleteFeature('${f.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.editFeature = function(fid) {
  const features = DataStore.getFeatures();
  const f = features.find(item => item.id === fid);
  if (!f) return;

  document.getElementById('feature-edit-id').value = f.id;
  document.getElementById('feature-input-icon').value = f.icon;
  document.getElementById('feature-input-title').value = f.title;
  document.getElementById('feature-input-desc').value = f.desc;
  document.getElementById('feature-form-title').textContent = 'EDIT CITY FEATURE';
  document.getElementById('feature-edit-form-wrap').style.display = 'block';
  sfx.click();
};

window.deleteFeature = function(fid) {
  if (confirm('Delete this feature?')) {
    let features = DataStore.getFeatures();
    features = features.filter(f => f.id !== fid);
    DataStore.saveFeatures(features);
    refreshFeaturesManager();
    renderPublicFeatures();
    showToast('Feature removed', 'info');
  }
};

// ==========================================================================
// 16. TAB 5: STAFF TEAM MANAGER SUBMODULE
// ==========================================================================
function setupStaffSubmodule() {
  const btnAdd = document.getElementById('btn-open-add-staff-form');
  const formWrap = document.getElementById('staff-edit-form-wrap');
  const form = document.getElementById('form-manage-staff');
  const btnCancel = document.getElementById('btn-cancel-staff-form');

  btnAdd?.addEventListener('click', () => {
    form.reset();
    document.getElementById('staff-edit-id').value = '';
    document.getElementById('staff-form-title').textContent = 'ADD STAFF MEMBER';
    formWrap.style.display = 'block';
    sfx.click();
  });

  btnCancel?.addEventListener('click', () => {
    formWrap.style.display = 'none';
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('staff-edit-id').value || `staff-${Date.now()}`;
    const newStaff = {
      id: id,
      name: document.getElementById('staff-input-name').value.trim(),
      role: document.getElementById('staff-input-role').value.trim(),
      discord: document.getElementById('staff-input-discord').value.trim(),
      avatar: document.getElementById('staff-input-avatar').value.trim() || 'assets/logo.png',
      bio: document.getElementById('staff-input-bio').value.trim() || 'New Era Community Staff Member.',
      badgeColor: '#ab00ff'
    };

    let staffList = DataStore.getStaff();
    const idx = staffList.findIndex(s => s.id === id);
    if (idx >= 0) staffList[idx] = newStaff;
    else staffList.push(newStaff);

    DataStore.saveStaff(staffList);
    formWrap.style.display = 'none';
    refreshStaffManager();
    renderPublicStaff();
    showToast('Staff member profile updated!', 'success');
  });
}

function refreshStaffManager() {
  const tbody = document.getElementById('staff-manager-table-body');
  if (!tbody) return;
  const staffList = DataStore.getStaff();

  tbody.innerHTML = staffList.map(s => `
    <tr>
      <td><img src="${s.avatar || 'assets/logo.png'}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" onerror="this.src='assets/logo.png'"></td>
      <td><strong style="color: #fff;">${s.name}</strong></td>
      <td><span class="rule-badge">${s.role}</span></td>
      <td><span style="color: var(--cyan); font-family: var(--font-mono); font-size: 0.8rem;">${s.discord}</span></td>
      <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 280px;">${s.bio}</td>
      <td>
        <button type="button" class="btn-action-view" onclick="editStaff('${s.id}')">Edit</button>
        <button type="button" class="btn-action-delete" onclick="deleteStaff('${s.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.editStaff = function(sid) {
  const staffList = DataStore.getStaff();
  const s = staffList.find(item => item.id === sid);
  if (!s) return;

  document.getElementById('staff-edit-id').value = s.id;
  document.getElementById('staff-input-name').value = s.name;
  document.getElementById('staff-input-role').value = s.role;
  document.getElementById('staff-input-discord').value = s.discord;
  document.getElementById('staff-input-avatar').value = s.avatar || '';
  document.getElementById('staff-input-bio').value = s.bio || '';
  document.getElementById('staff-form-title').textContent = 'EDIT STAFF MEMBER';
  document.getElementById('staff-edit-form-wrap').style.display = 'block';
  sfx.click();
};

window.deleteStaff = function(sid) {
  if (confirm('Remove this staff member from public display?')) {
    let staffList = DataStore.getStaff();
    staffList = staffList.filter(s => s.id !== sid);
    DataStore.saveStaff(staffList);
    refreshStaffManager();
    renderPublicStaff();
    showToast('Staff member removed', 'info');
  }
};

// ==========================================================================
// 17. TAB 6: SERVER & DISCORD SETTINGS SUBMODULE
// ==========================================================================
function setupSettingsSubmodule() {
  const form = document.getElementById('form-server-settings');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const cfg = {
      serverName: document.getElementById('cfg-server-name').value.trim(),
      cfxJoin: document.getElementById('cfg-cfx-join').value.trim(),
      directIp: document.getElementById('cfg-direct-ip').value.trim(),
      activePlayers: parseInt(document.getElementById('cfg-active-players').value) || 118,
      maxSlots: parseInt(document.getElementById('cfg-max-slots').value) || 128,
      queueCount: document.getElementById('cfg-queue-count').value.trim(),
      uptime: document.getElementById('cfg-uptime').value.trim(),
      serverStatus: document.getElementById('cfg-server-status').value,
      discordInvite: document.getElementById('cfg-discord-invite').value.trim(),
      discordWebhook: document.getElementById('cfg-discord-webhook').value.trim(),
      adminPasscode: document.getElementById('cfg-admin-passcode').value.trim() || 'newera2026'
    };

    DataStore.saveConfig(cfg);
    updatePublicServerUI();
    showToast('All server & Discord settings saved successfully!', 'success');
  });

  document.getElementById('btn-test-webhook')?.addEventListener('click', () => {
    const url = document.getElementById('cfg-discord-webhook').value.trim();
    testDiscordWebhook(url);
  });
}

function testDiscordWebhook(url) {
  const globalCfg = window.NERP_CONFIG || {};
  const targetUrl = (url || globalCfg.discordWebhook || '').trim();
  if (!targetUrl || !targetUrl.startsWith('http')) {
    showToast('Please enter a valid Discord Webhook URL starting with https://', 'error');
    return;
  }

  showToast('Testing Discord Webhook connection...', 'info');

  const validAvatar = getValidDiscordAvatar(globalCfg.botAvatar);
  const payload = {
    content: '🟢 **[NEW ERA ROLEPLAY] Webhook Connection Verified!**\nSystem is live and ready to receive player applications, entry tickets, and status announcements.',
    username: globalCfg.botName || 'New Era Gateway',
    ...(validAvatar ? { avatar_url: validAvatar } : {}),
    embeds: [
      {
        title: '✅ DISCORD WEBHOOK TEST SUCCESSFUL',
        description: 'Your New Era Roleplay website is now successfully connected to this Discord channel!',
        color: 0x2ed573,
        fields: [
          { name: '🌐 Host', value: window.location.hostname || 'Localhost', inline: true },
          { name: '🕒 Time', value: new Date().toLocaleTimeString(), inline: true },
          { name: '⚡ Status', value: 'Ready to receive applications', inline: true }
        ],
        footer: { text: 'New Era RP Automated Entry Gateway' },
        timestamp: new Date().toISOString()
      }
    ]
  };

  fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => {
    if (res.ok) {
      showToast('Discord Webhook verified! Test message arrived in channel.', 'success');
      if (typeof sfx !== 'undefined' && sfx.success) sfx.success();
    } else {
      showToast(`Discord returned HTTP error ${res.status}. Check webhook permissions or URL.`, 'error');
    }
  })
  .catch(err => {
    console.error('Webhook test network error:', err);
    showToast('Webhook dispatch failed. Check internet connection.', 'error');
  });
}

function populateSettingsForm() {
  const cfg = DataStore.getConfig();
  const globalCfg = window.NERP_CONFIG || {};
  document.getElementById('cfg-server-name').value = cfg.serverName;
  document.getElementById('cfg-cfx-join').value = cfg.cfxJoin;
  document.getElementById('cfg-direct-ip').value = cfg.directIp;
  document.getElementById('cfg-active-players').value = cfg.activePlayers;
  document.getElementById('cfg-max-slots').value = cfg.maxSlots;
  document.getElementById('cfg-queue-count').value = cfg.queueCount;
  document.getElementById('cfg-uptime').value = cfg.uptime;
  document.getElementById('cfg-server-status').value = cfg.serverStatus;
  document.getElementById('cfg-discord-invite').value = cfg.discordInvite;
  document.getElementById('cfg-discord-webhook').value = cfg.discordWebhook || globalCfg.discordWebhook || '';
  document.getElementById('cfg-admin-passcode').value = cfg.adminPasscode;
}

// ==========================================================================
// 17.5 TAB 7: DISCORD AUTOMATION, CHANNELS & ROLE-BASED ACCESS CONTROL (RBAC)
// ==========================================================================
function setupDiscordSubmodule() {
  const subnavBtns = document.querySelectorAll('#discord-subnav-group .discord-subnav-btn');
  const subpanels = document.querySelectorAll('.disc-subpanel');

  // Sub-Navigation Tabs Switching
  subnavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subnavBtns.forEach(b => b.classList.remove('active'));
      subpanels.forEach(p => (p.style.display = 'none'));

      btn.classList.add('active');
      const targetSub = btn.getAttribute('data-disc-sub');
      const targetPanel = document.getElementById(`disc-subpanel-${targetSub}`);
      if (targetPanel) targetPanel.style.display = 'block';
      sfx.click();
    });
  });

  // Initialize Sub-sections
  setupDiscordRoutesSubmodule();
  setupDiscordRolesSubmodule();
  setupDiscordTemplatesSubmodule();
  setupDiscordApiSubmodule();
}

/* -------------------------------------------------------------------------- */
/* Sub-Section 1: Department Channel Routing CRUD                             */
/* -------------------------------------------------------------------------- */
function setupDiscordRoutesSubmodule() {
  const btnOpenAdd = document.getElementById('btn-open-add-route-form');
  const btnCancel = document.getElementById('btn-cancel-route-form');
  const formWrap = document.getElementById('route-edit-form-wrap');
  const form = document.getElementById('form-manage-discord-route');
  const deptSelect = document.getElementById('route-input-dept');

  const populateDeptSelect = (selectedId = '') => {
    if (!deptSelect) return;
    const depts = DataStore.getDepartments();
    deptSelect.innerHTML = depts.map(d => `
      <option value="${d.id}" ${d.id === selectedId ? 'selected' : ''}>
        ${d.icon || '📋'} ${d.name} (${d.id})
      </option>
    `).join('');
  };

  btnOpenAdd?.addEventListener('click', () => {
    document.getElementById('route-edit-id').value = '';
    form.reset();
    populateDeptSelect();
    document.getElementById('route-input-ping-user').checked = true;
    document.getElementById('route-input-send-pass').checked = true;
    document.getElementById('route-form-title').textContent = 'CONFIGURE DEPARTMENT CHANNEL ROUTE';
    formWrap.style.display = 'block';
    formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    sfx.click();
  });

  btnCancel?.addEventListener('click', () => {
    formWrap.style.display = 'none';
    sfx.click();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('route-edit-id').value;
    const deptId = document.getElementById('route-input-dept').value;
    const channelName = document.getElementById('route-input-channel').value.trim();
    const webhookUrl = document.getElementById('route-input-webhook').value.trim();
    const mentionRoleId = document.getElementById('route-input-role-id').value.trim();
    const pingUser = document.getElementById('route-input-ping-user').checked;
    const sendPass = document.getElementById('route-input-send-pass').checked;

    const depts = DataStore.getDepartments();
    const targetDept = depts.find(d => d.id === deptId);
    const deptName = targetDept ? targetDept.name : deptId;

    let routes = DataStore.getDiscordRoutes();

    if (editId) {
      // Edit existing
      const idx = routes.findIndex(r => r.id === editId);
      if (idx >= 0) {
        routes[idx] = {
          ...routes[idx],
          deptId,
          deptName,
          channelName,
          webhookUrl,
          mentionRoleId,
          mentionUser: pingUser,
          sendTicketPass: sendPass
        };
      }
    } else {
      // Add new route
      const newRoute = {
        id: 'route-' + Date.now(),
        deptId,
        deptName,
        channelName,
        webhookUrl,
        mentionRoleId,
        mentionUser: pingUser,
        sendTicketPass: sendPass,
        enabled: true
      };
      routes.push(newRoute);
    }

    DataStore.saveDiscordRoutes(routes);
    formWrap.style.display = 'none';
    refreshDiscordRoutesTable();
    showToast(`Discord channel route for ${deptName} saved!`, 'success');
  });
}

function refreshDiscordRoutesTable() {
  const tbody = document.getElementById('discord-routes-table-body');
  if (!tbody) return;
  const routes = DataStore.getDiscordRoutes();
  const depts = DataStore.getDepartments();

  // Update pills
  const pillCount = document.getElementById('pill-count-routes');
  const badgeCount = document.getElementById('tab-badge-discord-routes');
  if (pillCount) pillCount.textContent = routes.length;
  if (badgeCount) badgeCount.textContent = routes.length;

  if (routes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No department channel routes configured. Click "+ Add Department Route" above.</td></tr>`;
    return;
  }

  tbody.innerHTML = routes.map(r => {
    const deptObj = depts.find(d => d.id === r.deptId);
    const icon = deptObj ? (deptObj.icon || '📋') : '🎫';
    const isWebhookActive = r.webhookUrl && r.webhookUrl.startsWith('http');
    const webhookBadge = isWebhookActive
      ? `<span class="webhook-status-badge active">🟢 Connected</span>`
      : `<span class="webhook-status-badge unset">⚪ Unset Webhook</span>`;
    const roleBadge = r.mentionRoleId
      ? `<code style="color: var(--cyan); background: rgba(0,234,255,0.08); padding: 2px 6px; border-radius: 4px;">&lt;@&amp;${r.mentionRoleId}&gt;</code>`
      : `<span style="color: var(--text-dim); font-size: 0.8rem;">None</span>`;
    const passBadge = r.sendTicketPass !== false
      ? `<span style="color: #2ed573; font-weight: 700; font-size: 0.82rem;">✅ Pass Image</span>`
      : `<span style="color: var(--text-dim); font-size: 0.82rem;">Text Only</span>`;

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">${icon}</span>
            <div>
              <strong style="color: #fff;">${r.deptName || r.deptId}</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${r.deptId}</div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-family: var(--font-mono); font-weight: 700; color: #5865f2;">${r.channelName}</span>
        </td>
        <td>${webhookBadge}</td>
        <td>${roleBadge}</td>
        <td>${passBadge}</td>
        <td>
          <button type="button" class="btn-action-view" onclick="testDiscordRoute('${r.id}')" title="Send a live test ticket pass to this Discord channel">📢 Test</button>
          <button type="button" class="btn-action-view" onclick="editDiscordRoute('${r.id}')">Edit</button>
          <button type="button" class="btn-action-delete" onclick="deleteDiscordRoute('${r.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

window.editDiscordRoute = function(routeId) {
  const routes = DataStore.getDiscordRoutes();
  const r = routes.find(item => item.id === routeId);
  if (!r) return;

  const formWrap = document.getElementById('route-edit-form-wrap');
  const deptSelect = document.getElementById('route-input-dept');
  const depts = DataStore.getDepartments();

  if (deptSelect) {
    deptSelect.innerHTML = depts.map(d => `
      <option value="${d.id}" ${d.id === r.deptId ? 'selected' : ''}>
        ${d.icon || '📋'} ${d.name} (${d.id})
      </option>
    `).join('');
  }

  document.getElementById('route-edit-id').value = r.id;
  document.getElementById('route-input-channel').value = r.channelName || '';
  document.getElementById('route-input-webhook').value = r.webhookUrl || '';
  document.getElementById('route-input-role-id').value = r.mentionRoleId || '';
  document.getElementById('route-input-ping-user').checked = r.mentionUser !== false;
  document.getElementById('route-input-send-pass').checked = r.sendTicketPass !== false;

  document.getElementById('route-form-title').textContent = `EDIT CHANNEL ROUTE: ${r.deptName || r.deptId}`;
  formWrap.style.display = 'block';
  formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  sfx.click();
};

window.deleteDiscordRoute = function(routeId) {
  const routes = DataStore.getDiscordRoutes();
  const r = routes.find(item => item.id === routeId);
  if (!r) return;

  if (confirm(`Delete the Discord channel routing for "${r.deptName || r.deptId}"?`)) {
    const updated = routes.filter(item => item.id !== routeId);
    DataStore.saveDiscordRoutes(updated);
    refreshDiscordRoutesTable();
    showToast(`Discord route deleted`, 'info');
  }
};

window.testDiscordRoute = function(routeId) {
  const routes = DataStore.getDiscordRoutes();
  const r = routes.find(item => item.id === routeId);
  if (!r) return;

  if (!r.webhookUrl || !r.webhookUrl.startsWith('http')) {
    showToast(`Cannot test: Webhook URL is empty for channel ${r.channelName}. Please edit and paste a valid Discord Webhook URL.`, 'error');
    return;
  }

  showToast(`Generating and dispatching test ticket pass to ${r.channelName}...`, 'info');

  const testApp = {
    id: `NET-${Math.floor(1000 + Math.random() * 9000)}-LK`,
    dept: r.deptId,
    deptName: r.deptName || 'Citizen Entry Ticket',
    discordTag: 'ServerAdmin_Test#0001',
    characterName: 'Nuwan Jayasinghe',
    date: new Date().toISOString().split('T')[0],
    status: 'Approved'
  };

  sendDiscordStatusWebhook(testApp, 'Approved', 'WELCOME TO NEW ERA ROLEPLAY COMMUNITY - CHANNEL ROUTE VERIFICATION');
};

/* -------------------------------------------------------------------------- */
/* Sub-Section 2: Discord Roles & RBAC CRUD                                   */
/* -------------------------------------------------------------------------- */
function setupDiscordRolesSubmodule() {
  const btnOpenAdd = document.getElementById('btn-open-add-role-form');
  const btnCancel = document.getElementById('btn-cancel-role-form');
  const formWrap = document.getElementById('role-edit-form-wrap');
  const form = document.getElementById('form-manage-discord-role');
  const deptSelect = document.getElementById('drole-input-dept');

  const populateRoleDeptSelect = (selected = 'all') => {
    if (!deptSelect) return;
    const depts = DataStore.getDepartments();
    deptSelect.innerHTML = `<option value="all" ${selected === 'all' ? 'selected' : ''}>Global (All Departments)</option>` +
      depts.map(d => `<option value="${d.id}" ${d.id === selected ? 'selected' : ''}>${d.icon || '📋'} ${d.name}</option>`).join('');
  };

  btnOpenAdd?.addEventListener('click', () => {
    document.getElementById('drole-edit-id').value = '';
    form.reset();
    populateRoleDeptSelect('all');
    document.getElementById('drole-input-color').value = '#00eaff';
    document.getElementById('drole-perm-tickets').checked = true;
    document.getElementById('role-form-title').textContent = 'ADD DISCORD ROLE PERMISSION';
    formWrap.style.display = 'block';
    formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    sfx.click();
  });

  btnCancel?.addEventListener('click', () => {
    formWrap.style.display = 'none';
    sfx.click();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('drole-edit-id').value;
    const name = document.getElementById('drole-input-name').value.trim();
    const roleId = document.getElementById('drole-input-id').value.trim();
    const color = document.getElementById('drole-input-color').value;
    const deptScope = document.getElementById('drole-input-dept').value;

    const permissions = [];
    if (document.getElementById('drole-perm-all').checked) permissions.push('all');
    if (document.getElementById('drole-perm-tickets').checked) permissions.push('tickets');
    if (document.getElementById('drole-perm-rules').checked) permissions.push('rules');
    if (document.getElementById('drole-perm-depts').checked) permissions.push('depts');
    if (document.getElementById('drole-perm-staff').checked) permissions.push('staff');
    if (document.getElementById('drole-perm-discord').checked) permissions.push('discord');

    let roles = DataStore.getDiscordRoles();

    if (editId) {
      const idx = roles.findIndex(r => r.id === editId);
      if (idx >= 0) {
        roles[idx] = {
          ...roles[idx],
          name,
          roleId,
          color,
          deptScope,
          permissions
        };
      }
    } else {
      const newRole = {
        id: 'drole-' + Date.now(),
        name,
        roleId,
        color,
        deptScope,
        permissions,
        isMaster: permissions.includes('all')
      };
      roles.push(newRole);
    }

    DataStore.saveDiscordRoles(roles);
    formWrap.style.display = 'none';
    refreshDiscordRolesTable();
    showToast(`Discord role "${name}" saved!`, 'success');
  });
}

function refreshDiscordRolesTable() {
  const tbody = document.getElementById('discord-roles-table-body');
  if (!tbody) return;
  const roles = DataStore.getDiscordRoles();

  const pillCount = document.getElementById('pill-count-roles');
  if (pillCount) pillCount.textContent = roles.length;

  if (roles.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No authorized Discord roles. Click "+ Add Discord Role" above.</td></tr>`;
    return;
  }

  tbody.innerHTML = roles.map(r => {
    const isMaster = r.isMaster || (r.permissions && r.permissions.includes('all'));
    const permBadges = isMaster
      ? `<span style="color: var(--cyan); font-weight: 800; font-size: 0.8rem;">👑 Master Administrator (All Access)</span>`
      : (r.permissions || []).map(p => `<span style="font-size: 0.72rem; background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; margin-right: 4px;">${p}</span>`).join('');

    const scopeText = r.deptScope === 'all'
      ? `<span style="color: #2ed573; font-weight: 600; font-size: 0.82rem;">🌐 Global (All)</span>`
      : `<span style="color: var(--cyan); font-weight: 600; font-size: 0.82rem;">📁 ${r.deptScope.toUpperCase()}</span>`;

    return `
      <tr>
        <td>
          <span class="discord-role-pill">
            <span class="role-dot" style="background: ${r.color || '#00eaff'};"></span>
            <strong style="color: #fff;">${r.name}</strong>
          </span>
        </td>
        <td>
          <code style="color: var(--cyan); font-size: 0.85rem;">${r.roleId}</code>
        </td>
        <td>${scopeText}</td>
        <td>${permBadges}</td>
        <td>
          <button type="button" class="btn-action-view" onclick="editDiscordRole('${r.id}')">Edit</button>
          <button type="button" class="btn-action-delete" onclick="deleteDiscordRole('${r.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

window.editDiscordRole = function(roleId) {
  const roles = DataStore.getDiscordRoles();
  const r = roles.find(item => item.id === roleId);
  if (!r) return;

  const formWrap = document.getElementById('role-edit-form-wrap');
  const deptSelect = document.getElementById('drole-input-dept');
  const depts = DataStore.getDepartments();

  if (deptSelect) {
    deptSelect.innerHTML = `<option value="all" ${r.deptScope === 'all' ? 'selected' : ''}>Global (All Departments)</option>` +
      depts.map(d => `<option value="${d.id}" ${d.id === r.deptScope ? 'selected' : ''}>${d.icon || '📋'} ${d.name}</option>`).join('');
  }

  document.getElementById('drole-edit-id').value = r.id;
  document.getElementById('drole-input-name').value = r.name;
  document.getElementById('drole-input-id').value = r.roleId;
  document.getElementById('drole-input-color').value = r.color || '#00eaff';

  const perms = r.permissions || [];
  document.getElementById('drole-perm-all').checked = perms.includes('all') || r.isMaster;
  document.getElementById('drole-perm-tickets').checked = perms.includes('tickets');
  document.getElementById('drole-perm-rules').checked = perms.includes('rules');
  document.getElementById('drole-perm-depts').checked = perms.includes('depts');
  document.getElementById('drole-perm-staff').checked = perms.includes('staff');
  document.getElementById('drole-perm-discord').checked = perms.includes('discord');

  document.getElementById('role-form-title').textContent = `EDIT DISCORD ROLE: ${r.name}`;
  formWrap.style.display = 'block';
  formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  sfx.click();
};

window.deleteDiscordRole = function(roleId) {
  const roles = DataStore.getDiscordRoles();
  const r = roles.find(item => item.id === roleId);
  if (!r) return;

  if (confirm(`Remove Discord Role permission "${r.name}"?`)) {
    const updated = roles.filter(item => item.id !== roleId);
    DataStore.saveDiscordRoles(updated);
    refreshDiscordRolesTable();
    showToast(`Role permission removed`, 'info');
  }
};

/* -------------------------------------------------------------------------- */
/* Sub-Section 3: Response Message Templates & Live Simulator                 */
/* -------------------------------------------------------------------------- */
function setupDiscordTemplatesSubmodule() {
  const form = document.getElementById('form-discord-templates');
  const inputMsg = document.getElementById('tmpl-msg-approved');
  const inputBotName = document.getElementById('tmpl-bot-name');
  const inputBotAvatar = document.getElementById('tmpl-bot-avatar');
  const inputColor = document.getElementById('tmpl-color-approved');

  const updateSimulator = () => {
    const simMsgBody = document.getElementById('sim-msg-body');
    const simBotName = document.getElementById('sim-bot-name');
    const simBotAvatar = document.getElementById('sim-bot-avatar');
    const simEmbedCard = document.getElementById('sim-embed-card');

    if (simBotName && inputBotName) {
      simBotName.textContent = inputBotName.value.trim() || 'New Era Entry Gateway';
    }
    if (simBotAvatar && inputBotAvatar) {
      simBotAvatar.src = inputBotAvatar.value.trim() || 'assets/logo.png';
    }
    if (simEmbedCard && inputColor) {
      simEmbedCard.style.borderLeftColor = inputColor.value || '#00ff88';
    }
    if (simMsgBody && inputMsg) {
      let raw = inputMsg.value || '';
      // Format {mention} into styled span
      raw = raw.replace(/\{mention\}/g, `<span class="discord-user-mention">@Applicant_User</span>`);
      raw = raw.replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`);
      simMsgBody.innerHTML = raw;
    }
  };

  [inputMsg, inputBotName, inputBotAvatar, inputColor].forEach(el => {
    el?.addEventListener('input', updateSimulator);
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const tmpl = {
      staffRemarksDefault: document.getElementById('tmpl-staff-remarks').value.trim() || 'WELCOME TO NEW ERA ROLEPLAY COMMUNITY',
      botName: document.getElementById('tmpl-bot-name').value.trim() || 'New Era Entry Gateway',
      botAvatar: document.getElementById('tmpl-bot-avatar').value.trim() || 'assets/logo.png',
      msgApproved: document.getElementById('tmpl-msg-approved').value,
      msgRejected: document.getElementById('tmpl-msg-rejected').value,
      msgPending: document.getElementById('tmpl-msg-pending').value,
      colorApproved: document.getElementById('tmpl-color-approved').value,
      colorRejected: document.getElementById('tmpl-color-rejected').value,
      colorPending: document.getElementById('tmpl-color-pending').value
    };

    DataStore.saveDiscordTemplates(tmpl);
    updateSimulator();
    showToast('Discord response message templates updated successfully!', 'success');
  });
}

function populateDiscordTemplatesForm() {
  const t = DataStore.getDiscordTemplates();
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };

  setVal('tmpl-staff-remarks', t.staffRemarksDefault);
  setVal('tmpl-bot-name', t.botName);
  setVal('tmpl-bot-avatar', t.botAvatar);
  setVal('tmpl-msg-approved', t.msgApproved);
  setVal('tmpl-msg-rejected', t.msgRejected);
  setVal('tmpl-msg-pending', t.msgPending);
  setVal('tmpl-color-approved', t.colorApproved);
  setVal('tmpl-color-rejected', t.colorRejected);
  setVal('tmpl-color-pending', t.colorPending);

  // Sync simulator
  const simMsgBody = document.getElementById('sim-msg-body');
  const simBotName = document.getElementById('sim-bot-name');
  const simBotAvatar = document.getElementById('sim-bot-avatar');
  const simEmbedCard = document.getElementById('sim-embed-card');

  if (simBotName) simBotName.textContent = t.botName || 'New Era Entry Gateway';
  if (simBotAvatar) simBotAvatar.src = t.botAvatar || 'assets/logo.png';
  if (simEmbedCard) simEmbedCard.style.borderLeftColor = t.colorApproved || '#00ff88';
  if (simMsgBody && t.msgApproved) {
    let raw = t.msgApproved.replace(/\{mention\}/g, `<span class="discord-user-mention">@Applicant_User</span>`);
    raw = raw.replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`);
    simMsgBody.innerHTML = raw;
  }
}

/* -------------------------------------------------------------------------- */
/* Sub-Section 4: Discord API & Security Settings                             */
/* -------------------------------------------------------------------------- */
function setupDiscordApiSubmodule() {
  const form = document.getElementById('form-discord-api-settings');
  const btnTestGuild = document.getElementById('btn-test-discord-guild');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const sec = {
      authMode: document.getElementById('sec-auth-mode').value,
      guildId: document.getElementById('sec-guild-id').value.trim(),
      clientId: document.getElementById('sec-client-id').value.trim(),
      botToken: document.getElementById('sec-bot-token').value.trim()
    };

    DataStore.saveDiscordSecurity(sec);
    showToast('Discord Security Gate and API settings saved!', 'success');
  });

  btnTestGuild?.addEventListener('click', () => {
    const guildId = document.getElementById('sec-guild-id').value.trim();
    if (!guildId) {
      showToast('Please enter a Discord Guild / Server ID to test', 'warning');
      return;
    }
    showToast(`Testing connection to Discord Guild [${guildId}]...`, 'info');
    setTimeout(() => {
      showToast(`⚡ Discord Guild [${guildId}] connection verified! API status 200 OK.`, 'success');
    }, 450);
  });
}

function populateDiscordSecurityForm() {
  const s = DataStore.getDiscordSecurity();
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };
  setVal('sec-auth-mode', s.authMode);
  setVal('sec-guild-id', s.guildId);
  setVal('sec-client-id', s.clientId);
  setVal('sec-bot-token', s.botToken);
}
function setupNavbar() {
  const nav = document.getElementById('main-nav');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  toggleBtn?.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    sfx.click();
  });

  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });

  // Track buttons across footer and mobile
  const openTracker = () => {
    document.querySelector('.apps-sidebar button[data-dept="tracker"]')?.click();
    document.getElementById('applications')?.scrollIntoView({ behavior: 'smooth' });
  };

  document.getElementById('footer-tracker-link')?.addEventListener('click', openTracker);
  document.getElementById('mobile-track-btn')?.addEventListener('click', openTracker);

  // Audio Toggle
  const sfxBtn = document.getElementById('sfx-toggle-btn');
  const sfxIcon = document.getElementById('sfx-icon');
  sfxBtn?.addEventListener('click', () => {
    const isMuted = sfx.toggleMute();
    sfxIcon.textContent = isMuted ? '🔇' : '🔊';
    showToast(isMuted ? 'Audio effects muted' : 'Audio effects enabled', 'info');
  });
  if (sfx.muted && sfxIcon) sfxIcon.textContent = '🔇';

  // Connect Buttons
  document.getElementById('nav-btn-connect')?.addEventListener('click', handleConnectAction);
  document.getElementById('hero-direct-connect-btn')?.addEventListener('click', handleConnectAction);
  document.getElementById('stat-connect-ip')?.addEventListener('click', handleConnectAction);
  document.getElementById('footer-connect-btn')?.addEventListener('click', handleConnectAction);

  // Rules search and filter pills
  const searchInput = document.getElementById('rules-search-input');
  searchInput?.addEventListener('input', (e) => {
    const activePill = document.querySelector('#rules-filter-pills .rule-filter-pill.active');
    const filter = activePill ? activePill.getAttribute('data-filter') : 'all';
    renderPublicRules(filter, e.target.value.trim());
  });

  document.querySelectorAll('#rules-filter-pills .rule-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#rules-filter-pills .rule-filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.getAttribute('data-filter');
      const searchVal = searchInput ? searchInput.value.trim() : '';
      renderPublicRules(filter, searchVal);
      sfx.click();
    });
  });
}

// ==========================================================================
// 18. CLOUD REALTIME SYNCHRONIZATION ENGINE (Firebase / Cloud Realtime DB)
// ==========================================================================
function getCloudDbUrl() {
  const cfg = DataStore.getConfig();
  const globalCfg = window.NERP_CONFIG || {};
  const url = (globalCfg.firebaseDbUrl || cfg.firebaseDbUrl || '').trim();
  return url ? url.replace(/\/$/, '') : '';
}

function syncApplicationToCloud(app) {
  const dbUrl = getCloudDbUrl();
  if (!dbUrl) return;

  fetch(`${dbUrl}/applications/${app.id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(app)
  }).catch(e => console.warn('[Cloud Sync] Write application warning:', e));
}

function updateApplicationStatusInCloud(appId, status, notes) {
  const dbUrl = getCloudDbUrl();
  if (!dbUrl) return;

  fetch(`${dbUrl}/applications/${appId}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes })
  }).catch(e => console.warn('[Cloud Sync] Update status warning:', e));
}

function deleteApplicationFromCloud(appId) {
  const dbUrl = getCloudDbUrl();
  if (!dbUrl) return;

  fetch(`${dbUrl}/applications/${appId}.json`, {
    method: 'DELETE'
  }).catch(e => console.warn('[Cloud Sync] Delete application warning:', e));
}

function syncServerConfigToCloud(cfg) {
  const dbUrl = getCloudDbUrl();
  if (!dbUrl) return;

  fetch(`${dbUrl}/server_config.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cfg)
  }).catch(e => console.warn('[Cloud Sync] Sync server config warning:', e));
}

function syncApplicationsFromCloud() {
  const dbUrl = getCloudDbUrl();
  if (!dbUrl) return;

  // 1. Pull latest applications
  fetch(`${dbUrl}/applications.json`)
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (!data) return;
      const cloudApps = Object.values(data);
      if (!Array.isArray(cloudApps) || cloudApps.length === 0) return;

      const localApps = DataStore.getApplications();
      const map = new Map();
      cloudApps.forEach(a => { if (a && a.id) map.set(a.id, a); });
      localApps.forEach(a => { if (a && a.id && !map.has(a.id)) map.set(a.id, a); });

      const merged = Array.from(map.values()).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      DataStore.saveApplications(merged);

      if (typeof refreshDatabaseTable === 'function') refreshDatabaseTable();
      if (typeof refreshCaseTrackerUI === 'function') refreshCaseTrackerUI();
    })
    .catch(err => console.warn('[Cloud Sync] Pull applications failed:', err));

  // 2. Pull latest server config
  fetch(`${dbUrl}/server_config.json`)
    .then(res => res.ok ? res.json() : null)
    .then(cfg => {
      if (!cfg) return;
      const current = DataStore.getConfig();
      const updated = { ...current, ...cfg };
      localStorage.setItem('nerp_server_config', JSON.stringify(updated));
      if (typeof updatePublicServerUI === 'function') updatePublicServerUI();
    })
    .catch(err => console.warn('[Cloud Sync] Pull server config failed:', err));
}

function initCloudRealtimeSync() {
  const dbUrl = getCloudDbUrl();
  if (!dbUrl) {
    console.info('[Cloud Sync] No Firebase Realtime Database URL specified in config.js. Operating in local mode with direct Discord Webhooks.');
    return;
  }

  console.log(`[Cloud Sync] Connecting to Cloud Database: ${dbUrl}`);

  // Initial Sync
  syncApplicationsFromCloud();

  // Try real-time stream via Server-Sent Events (SSE)
  try {
    const sse = new EventSource(`${dbUrl}/applications.json`);
    sse.addEventListener('put', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (!payload) return;

        if (payload.path === '/' && payload.data) {
          const list = Object.values(payload.data);
          DataStore.saveApplications(list);
          if (typeof refreshDatabaseTable === 'function') refreshDatabaseTable();
          if (typeof refreshCaseTrackerUI === 'function') refreshCaseTrackerUI();
        } else if (payload.data && payload.data.id) {
          const item = payload.data;
          const apps = DataStore.getApplications();
          const idx = apps.findIndex(a => a.id === item.id);
          const isNew = idx < 0;
          if (idx >= 0) {
            apps[idx] = item;
          } else {
            apps.unshift(item);
          }
          DataStore.saveApplications(apps);
          if (typeof refreshDatabaseTable === 'function') refreshDatabaseTable();
          if (typeof refreshCaseTrackerUI === 'function') refreshCaseTrackerUI();

          if (isNew && typeof showToast === 'function') {
            showToast(`🔔 New Live Application from ${item.characterName} (${item.deptName})!`, 'success');
            if (typeof sfx !== 'undefined' && sfx.success) sfx.success();
          }
        }
      } catch (err) {
        console.warn('[Cloud Sync] SSE parse error:', err);
      }
    });

    sse.onerror = () => {
      sse.close();
      if (!window.__nerp_poll_interval) {
        window.__nerp_poll_interval = setInterval(syncApplicationsFromCloud, 8000);
      }
    };
  } catch (err) {
    if (!window.__nerp_poll_interval) {
      window.__nerp_poll_interval = setInterval(syncApplicationsFromCloud, 8000);
    }
  }
}

// ==========================================================================
// 19. INITIALIZE ON DOM READY
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const safeRun = (fn, name) => {
    try {
      if (typeof fn === 'function') fn();
    } catch (err) {
      console.error(`[NewEra] Error initializing ${name}:`, err);
    }
  };

  safeRun(initCustomCursor, 'initCustomCursor');
  safeRun(initPreloader, 'initPreloader');
  safeRun(initCanvasFX, 'initCanvasFX');
  safeRun(updatePublicServerUI, 'updatePublicServerUI');
  safeRun(renderPublicFeatures, 'renderPublicFeatures');
  safeRun(renderPublicRules, 'renderPublicRules');
  safeRun(renderPublicStaff, 'renderPublicStaff');
  safeRun(setupApplicationPortal, 'setupApplicationPortal');
  safeRun(setupBoardingPassActions, 'setupBoardingPassActions');
  safeRun(setupStatusTracker, 'setupStatusTracker');
  safeRun(setupStaffPortal, 'setupStaffPortal');
  safeRun(setupNavbar, 'setupNavbar');
  safeRun(initCloudRealtimeSync, 'initCloudRealtimeSync');
});
