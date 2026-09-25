<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>NEW ERA ROLEPLAY COMMUNITY | Premier FiveM Server Sri Lanka</title>
  <meta name="title" content="NEW ERA ROLEPLAY COMMUNITY | Premier FiveM Server Sri Lanka">
  <meta name="description" content="Welcome to NEW ERA ROLEPLAY COMMUNITY - Sri Lanka's premier custom FiveM roleplay community server. Apply for Entry Ticket, view live server status, staff team, rules, and join our active city today!">
  <meta name="keywords" content="New Era Roleplay, New Era RP, FiveM Sri Lanka, FiveM Server, GTA V Roleplay, New Era FiveM, Entry Ticket RP">
  <meta name="theme-color" content="#ab00ff">
  
  <!-- Open Graph / Facebook / Discord -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://neweraroleplay.com/">
  <meta property="og:title" content="NEW ERA ROLEPLAY COMMUNITY | Premier FiveM Server Sri Lanka">
  <meta property="og:description" content="Join NEW ERA ROLEPLAY COMMUNITY - Sri Lanka's leading FiveM community with custom economy, vehicles, emergency services, and active RP.">
  <meta property="og:image" content="assets/hero_title.png">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="assets/logo.png">
  
  <!-- Stylesheet -->
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Background Canvas & Grids -->
  <canvas id="fx-canvas"></canvas>
  <div class="ambient-glow"></div>
  <div class="radar-grid"></div>

  <!-- Preloader -->
  <div id="preloader">
    <div class="preloader-inner">
      <div class="preloader-logo-ring">
        <div class="ambient-glow" style="position: absolute; width: 100%; height: 100%; background: radial-gradient(circle, rgba(0, 234, 255, 0.3), transparent 70%);"></div>
        <img src="assets/logo.png" alt="New Era Logo" class="preloader-logo-img">
        <svg class="preloader-ring-svg" viewBox="0 0 130 130">
          <circle class="ring-track" cx="65" cy="65" r="60"></circle>
          <circle class="ring-progress" cx="65" cy="65" r="60"></circle>
        </svg>
      </div>
      <div class="preloader-title">NEW ERA <span>ROLEPLAY</span></div>
      <div class="preloader-bar-wrap">
        <div class="preloader-bar"></div>
      </div>
      <div class="preloader-meta">
        <span>INITIALIZING CITY ASSETS</span>
        <span id="preloader-percent">0%</span>
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div id="toast-container"></div>

  <!-- Floating Audio SFX Toggle -->
  <button id="sfx-toggle-btn" class="floating-sfx-btn" title="Toggle Futuristic Sound Effects" aria-label="Toggle Sound Effects">
    <span id="sfx-icon">🔊</span>
  </button>

  <!-- Navigation Bar -->
  <nav class="navbar" id="main-nav">
    <div class="container nav-container">
      <a href="#home" class="brand-logo">
        <img src="assets/logo.png" alt="New Era Logo" class="brand-img">
        <div class="brand-text">
          <div class="brand-name">NEW ERA <span>ROLEPLAY</span></div>
          <div class="brand-badge">SRI LANKA FIVEM</div>
        </div>
      </a>

      <div class="nav-links">
        <a href="#home" class="nav-link active">HOME</a>
        <a href="#status-section" class="nav-link">SERVER STATUS</a>
        <a href="#features" class="nav-link">FEATURES</a>
        <a href="#applications" class="nav-link">ENTRY TICKET</a>
        <a href="#rules" class="nav-link">RULES</a>
        <a href="#staff" class="nav-link">STAFF TEAM</a>
        <a href="javascript:void(0)" class="nav-link nav-link-admin staff-portal-trigger-link" id="nav-btn-admin-portal" title="Open Staff / Admin Management Console">
          <span class="nav-admin-badge">🛡️ ADMIN PORTAL</span>
        </a>
      </div>

      <div class="nav-actions">
        <a href="https://discord.com/invite/bZ2YpSrq8" target="_blank" rel="noopener noreferrer" class="btn-discord" id="nav-btn-discord" title="Join Discord Community">
          <span class="btn-icon">💬</span>
          <span>DISCORD</span>
        </a>
        <button class="btn-connect" id="nav-btn-connect" title="Connect to FiveM Server">
          <span class="pulse-dot"></span>
          <span>CONNECT</span>
        </button>
        <button class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Toggle Navigation">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Drawer -->
  <div class="mobile-nav" id="mobile-nav">
    <a href="#home">Home</a>
    <a href="#status-section">Server Status</a>
    <a href="#features">Features</a>
    <a href="#applications">Entry Ticket Application</a>
    <a href="#rules">Server Rules</a>
    <a href="#staff">Staff Team</a>
    <a href="javascript:void(0)" id="mobile-track-btn">Track Application</a>
    <a href="javascript:void(0)" class="staff-portal-trigger-link" id="mobile-staff-portal-btn" style="color: #e0aaff; font-weight: 700; background: rgba(171, 0, 255, 0.18); border: 1px solid rgba(171,0,255,0.4); padding: 0.8rem 1rem; border-radius: 10px; margin-top: 0.8rem; display: flex; align-items: center; gap: 8px;">🛡️ Admin Portal</a>
  </div>

  <!-- Hero Section -->
  <header class="hero" id="home">
    <div class="hero-bg-wrapper">
      <img src="assets/newera_city_banner.jpg" alt="New Era Community City" class="hero-bg-img">
      <div class="hero-overlay"></div>
    </div>

    <div class="container hero-content">
      <div class="hero-badge">
        <span class="pulse-dot"></span>
        <span id="hero-badge-text">NEW ERA V2.0 • SRI LANKA'S PREMIER FIVEM ROLEPLAY</span>
      </div>

      <!-- Official Brand Showcase: Wide 3D Banner Wordmark -->
      <div class="hero-brand-showcase">
        <div class="hero-banner-title-wrap">
          <img src="assets/hero_title.png" alt="NEW ERA COMMUNITY" class="hero-banner-title-img">
        </div>
      </div>

      <h1 class="hero-title">
        THE NEXT GENERATION OF <span class="gradient-text">ROLEPLAY</span>
      </h1>

      <p class="hero-desc">
        Welcome to <strong>NEW ERA ROLEPLAY COMMUNITY</strong>. Step into a living city redefined with balanced custom economy, 600+ hand-tuned import vehicles, active emergency services, and an immersive storyline created by you.
      </p>

      <div class="hero-buttons">
        <a href="#applications" class="btn-primary" id="hero-apply-btn">
          <span>🎫 GET ENTRY TICKET</span>
        </a>
        <a href="#features" class="btn-glass">
          <span>EXPLORE CITY</span>
        </a>
        <a href="https://discord.com/invite/bZ2YpSrq8" target="_blank" rel="noopener noreferrer" class="btn-discord" id="hero-btn-discord">
          <span>JOIN DISCORD (1,850+ CITIZENS)</span>
        </a>
      </div>

      <!-- Live Server Stats Glass Bar -->
      <div class="server-stats-bar" id="status-section">
        <div class="stat-box">
          <span class="stat-title">SERVER STATUS</span>
          <div class="stat-pill online" id="stat-pill-status">
            <span class="pulse-dot"></span>
            <span id="live-server-status-text">ONLINE</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-box">
          <span class="stat-title">ACTIVE CITIZENS</span>
          <div class="stat-pill counter">
            <span id="live-player-count">118 / 128</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-box">
          <span class="stat-title">QUEUE</span>
          <div class="stat-pill counter" style="color: #67e8f9;">
            <span id="live-queue-count">14 IN LINE</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-box">
          <span class="stat-title">UPTIME</span>
          <div class="stat-pill uptime">
            <span id="live-uptime">99.98% (24h 10m)</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-box">
          <span class="stat-title">DIRECT CONNECT</span>
          <div class="stat-pill connect-ip" id="stat-connect-ip" title="Click to copy FiveM connect command">
            <span id="live-connect-ip-text">cfx.re/join/newera 📋</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Features Section -->
  <section class="section" id="features">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">WHY CHOOSE NEW ERA</span>
        <h2 class="section-title">BUILT FOR TRUE ROLEPLAYERS</h2>
        <p class="section-subtitle">We prioritize high-quality roleplay interactions, optimized server performance, custom scripts, and an active dedicated community staff.</p>
      </div>

      <!-- Dynamically Populated Features Grid -->
      <div class="features-grid" id="features-grid">
        <!-- Rendered dynamically by app.js -->
      </div>
    </div>
  </section>

  <!-- Applications Portal Section -->
  <section class="section" id="applications" style="background: rgba(10, 13, 20, 0.6);">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">OFFICIAL APPLICATION PORTAL</span>
        <h2 class="section-title">GET YOUR ENTRY TICKET & JOIN</h2>
        <p class="section-subtitle">Submit your Citizen Entry Ticket application or apply for prestigious government and civilian departments. Receive an official digital boarding pass upon submission!</p>
      </div>

      <div class="applications-wrapper">
        <!-- Sidebar Navigation -->
        <aside class="apps-sidebar">
          <div class="apps-sidebar-title">DEPARTMENTS</div>
          <div id="apps-sidebar-dept-list">
            <!-- Dynamically populated from DataStore.getDepartments() -->
          </div>
          <button class="category-btn" data-dept="tracker" id="btn-sidebar-tracker" style="margin-top: 1rem; border-top: 1px solid var(--border-glass); padding-top: 1.2rem;">
            <span class="cat-icon">🔍</span>
            <span>Track Application Case</span>
          </button>
        </aside>

        <!-- Main Form Content -->
        <main class="apps-main-content">
          <div class="glass-form-card">
            
            <div class="form-dept-header">
              <div class="dept-badge-icon" id="dept-badge-icon">🎫</div>
              <div class="dept-header-info">
                <h2 id="dept-header-title">Citizen Entry Ticket Application</h2>
                <p id="dept-header-desc">Complete all 3 stages: Out-of-Character background, character persona, and roleplay scenario evaluation.</p>
              </div>
            </div>

            <!-- Entry Ticket Stepper Nav -->
            <div class="stepper-nav" id="stepper-nav">
              <div class="step-item active" data-step="1">
                <div class="step-circle">1</div>
                <span class="step-label">OOC INFO</span>
              </div>
              <div class="step-divider-line"></div>
              <div class="step-item" data-step="2">
                <div class="step-circle">2</div>
                <span class="step-label">CHARACTER</span>
              </div>
              <div class="step-divider-line"></div>
              <div class="step-item" data-step="3">
                <div class="step-circle">3</div>
                <span class="step-label">SCENARIOS</span>
              </div>
            </div>

            <!-- Form -->
            <form id="whitelist-full-form" novalidate>
              <!-- Step 1: OOC Information -->
              <div id="form-step-1">
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Discord Username & Tag <span class="req">*</span></label>
                    <input type="text" class="form-control" id="input-discord" placeholder="e.g. Kasun#1234 or kasun_rp" required>
                  </div>
                  <div class="form-group">
                    <label>Steam Hex / FiveM License <span class="req">*</span></label>
                    <input type="text" class="form-control" id="input-steam" placeholder="e.g. steam:11000010abcde or license:xxx" required>
                  </div>
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Real Age <span class="req">*</span></label>
                    <input type="number" class="form-control" id="input-age" min="15" max="65" placeholder="e.g. 21" required>
                  </div>
                  <div class="form-group">
                    <label>Timezone & Primary Play Hours <span class="req">*</span></label>
                    <input type="text" class="form-control" id="input-timezone" placeholder="e.g. GMT+5:30 (Sri Lanka) / 8 PM - 1 AM">
                  </div>
                </div>

                <div class="form-group">
                  <label>Previous FiveM / Roleplay Experience</label>
                  <textarea class="form-control" id="input-experience" placeholder="Detail any previous servers, departments or serious RP experience..."></textarea>
                </div>
              </div>

              <!-- Step 2: In-Character (IC) Profile -->
              <div id="form-step-2" style="display: none;">
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Character Full Name <span class="req">*</span></label>
                    <input type="text" class="form-control" id="input-char-name" placeholder="e.g. James Vane or Kamal Gunawardena">
                  </div>
                  <div class="form-group">
                    <label>Character Age & Gender <span class="req">*</span></label>
                    <input type="text" class="form-control" id="input-char-age" placeholder="e.g. 27 Years / Male">
                  </div>
                </div>

                <div class="form-group">
                  <label>Character Background Story & Ambition in New Era <span class="req">*</span></label>
                  <textarea class="form-control" id="input-char-backstory" style="min-height: 140px;" placeholder="Write a short backstory explaining where your character came from, why they flew into New Era City, and what goals they hope to pursue (legal or illegal)..."></textarea>
                </div>
              </div>

              <!-- Step 3: Rules & Scenarios (Dynamically Rendered from Questions Manager) -->
              <div id="form-step-3" style="display: none;">
                <div id="dynamic-scenarios-container">
                  <!-- Populated dynamically by app.js from Questions Store -->
                </div>

                <div class="checkbox-group" style="margin-top: 1.5rem;">
                  <input type="checkbox" id="terms-agree" required>
                  <label for="terms-agree">
                    <span>I have read and agree to follow all <a href="#rules">New Era Roleplay Community Rules</a>, uphold serious RP standards, value my life (Fear RP), and treat all community members with respect.</span>
                  </label>
                </div>
              </div>

              <!-- Dynamic Extra Fields for Police, EMS, Mechanic, Staff, Business -->
              <div id="dynamic-dept-section"></div>

              <!-- Actions -->
              <div class="form-actions-row">
                <button type="button" class="btn-glass" id="btn-step-prev" style="display: none;">◀ PREVIOUS</button>
                <div style="flex-grow: 1;"></div>
                <button type="button" class="btn-primary" id="btn-step-next">NEXT STEP ▶</button>
                <button type="submit" class="btn-primary" id="btn-step-submit" style="display: none;">SUBMIT ENTRY TICKET 🚀</button>
              </div>
            </form>

            <!-- Application Status Tracker Form (Inside Main Area) -->
            <div id="application-tracker-section" style="display: none;">
              <div class="status-tracker-card">
                <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">🔍</div>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">TRACK APPLICATION CASE</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">Enter your Ticket Reference ID (e.g. NET-8492-LK) or your Discord Tag to check review status in real time.</p>
                
                <div class="tracker-input-row">
                  <input type="text" class="form-control" id="input-tracker-query" placeholder="e.g. NET-8492-LK or Kasun#1234">
                  <button type="button" class="btn-primary" id="btn-check-status">CHECK STATUS</button>
                </div>

                <div class="tracker-result-box" id="tracker-result-box"></div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  </section>

  <!-- Interactive Entry Ticket Boarding Pass Modal -->
  <div class="ticket-modal-overlay" id="ticket-modal-overlay">
    <div class="ticket-modal-container">
      
      <div class="flight-ticket">
        <!-- Left Ticket Side -->
        <div class="ticket-left">
          <div class="ticket-header-row">
            <div class="ticket-airline-title">
              <img src="assets/logo.png" alt="Logo" style="width: 32px; height: 32px; vertical-align: middle; margin-right: 8px;">
              NEW ERA <span>ROLEPLAY</span>
            </div>
            <div class="ticket-type-badge" id="ticket-pass-dept">CITIZEN ENTRY TICKET</div>
          </div>

          <div class="ticket-flight-route">
            <div class="route-city">
              <span class="route-code">ORIGIN</span>
              <span class="route-name">CIVILIAN TRANSIT</span>
            </div>
            <div class="flight-icon-center">✈</div>
            <div class="route-city" style="text-align: right;">
              <span class="route-code">DEST</span>
              <span class="route-name">NEW ERA CITY</span>
            </div>
          </div>

          <div class="ticket-details-grid">
            <div class="detail-item">
              <span class="lbl">CITIZEN NAME</span>
              <span class="val" id="ticket-val-name">Dilan Perera</span>
            </div>
            <div class="detail-item">
              <span class="lbl">DISCORD ID</span>
              <span class="val" id="ticket-val-discord">Kasun_Silva#4412</span>
            </div>
            <div class="detail-item">
              <span class="lbl">STAFF REMARKS</span>
              <span class="val" id="ticket-val-remarks" style="color: var(--cyan); font-size: 0.85rem; font-weight: 700;">WELCOME TO NEW ERA ROLEPLAY COMMUNITY</span>
            </div>
            <div class="detail-item">
              <span class="lbl">TICKET REF</span>
              <span class="val" id="ticket-val-id" style="color: var(--cyan);">NET-8492-LK</span>
            </div>
            <div class="detail-item">
              <span class="lbl">SUBMISSION DATE</span>
              <span class="val" id="ticket-val-date">2026-09-24</span>
            </div>
            <div class="detail-item">
              <span class="lbl">REVIEW STATUS</span>
              <span class="val status-pending" id="ticket-val-status">PENDING REVIEW</span>
            </div>
          </div>

          <div class="ticket-footer-note">
            <span>🛡️ OFFICIAL NEW ERA ENTRY PASS • PRESENT THIS PASS IN FIVEM CONNECT GATE</span>
          </div>
        </div>

        <!-- Perforated Divider -->
        <div class="ticket-tear-line">
          <div class="notch top"></div>
          <div class="dash-line"></div>
          <div class="notch bottom"></div>
        </div>

        <!-- Right Stub Side -->
        <div class="ticket-right">
          <div class="stub-header">
            <span>ENTRY STUB</span>
            <span id="stub-ref-id">NET-8492</span>
          </div>
          
          <div class="stub-qr-box">
            <div class="qr-placeholder">
              <div class="qr-pattern"></div>
              <img src="assets/logo.png" alt="Logo" class="qr-center-icon">
            </div>
            <span class="qr-lbl">OFFICIAL PASSPORT SEED</span>
          </div>

          <div class="stub-info">
            <span class="stub-lbl">HOLDER</span>
            <span class="stub-val" id="stub-val-holder">Dilan Perera</span>
          </div>

          <div class="ticket-barcode">
            <div class="bars"></div>
          </div>
        </div>
      </div>

      <!-- Modal Action Buttons -->
      <div class="ticket-modal-actions">
        <button class="btn-primary" id="btn-print-ticket">
          <span>🖨️ PRINT / SAVE PASS</span>
        </button>
        <button class="btn-glass" id="btn-copy-ticket-id">
          <span>📋 COPY TICKET ID</span>
        </button>
        <button class="btn-glass" id="btn-close-ticket-modal">
          <span>✕ CLOSE</span>
        </button>
      </div>

    </div>
  </div>

  <!-- Server Rules Section -->
  <section class="section" id="rules">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">SERVER GUIDELINES & ROLEPLAY LAWS</span>
        <h2 class="section-title">NEW ERA CITY RULES</h2>
        <p class="section-subtitle">Strict enforcement guarantees maximum immersion. Read and understand our core roleplay regulations before connecting to the city.</p>
      </div>

      <!-- Search & Category Filters -->
      <div class="rules-toolbar">
        <div class="rules-search-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" id="rules-search-input" placeholder="Search rules (e.g. RDM, Fear RP, NLR, Robberies, Safe Zones)...">
        </div>
        <div class="rules-filters" id="rules-filter-pills">
          <button class="rule-filter-pill active" data-filter="all">ALL RULES</button>
          <button class="rule-filter-pill" data-filter="general">GENERAL RP</button>
          <button class="rule-filter-pill" data-filter="combat">COMBAT & CRIMES</button>
          <button class="rule-filter-pill" data-filter="robbery">ROBBERIES</button>
          <button class="rule-filter-pill" data-filter="safezone">SAFE ZONES</button>
        </div>
      </div>

      <!-- Dynamically Populated Rules Accordion -->
      <div class="rules-accordion" id="rules-accordion-container">
        <!-- Rendered dynamically by app.js from Rules Store -->
      </div>
    </div>
  </section>

  <!-- Staff Team Section (Dynamic, No Fake Names!) -->
  <section class="section" id="staff" style="background: rgba(10, 13, 20, 0.4);">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">COMMUNITY LEADERSHIP</span>
        <h2 class="section-title">MEET THE NEW ERA STAFF</h2>
        <p class="section-subtitle">Our dedicated team works around the clock to ensure balanced gameplay, technical excellence, and fair moderation.</p>
      </div>

      <!-- Dynamically Populated Staff Grid -->
      <div class="staff-grid" id="staff-grid">
        <!-- Rendered dynamically by app.js from Staff Store -->
      </div>
    </div>
  </section>

  <!-- Public Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand-wrap">
            <img src="assets/logo.png" alt="New Era Logo" class="brand-logo-img">
            <div class="brand-text-block">
              <span class="brand-name">NEW ERA</span>
              <span class="brand-sub">ROLEPLAY COMMUNITY</span>
            </div>
          </div>
          <p>Sri Lanka's leading FiveM custom roleplay server. Built by roleplayers, for roleplayers. Join our city today and craft your legacy.</p>
          <div style="margin-top: 1.2rem; display: flex; gap: 0.8rem;">
            <a href="https://discord.com/invite/bZ2YpSrq8" target="_blank" class="btn-glass" id="footer-discord-link" style="padding: 0.5rem 1rem; font-size: 0.85rem;">💬 Discord</a>
            <button type="button" class="btn-glass" id="footer-connect-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;">🌐 FiveM Join</button>
          </div>
        </div>

        <div class="footer-col">
          <h4>NAVIGATION</h4>
          <ul class="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#status-section">Server Status</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#applications">Entry Ticket</a></li>
            <li><a href="#rules">Server Rules</a></li>
            <li><a href="#staff">Staff Team</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>DEPARTMENTS</h4>
          <ul class="footer-links">
            <li><a href="#applications" data-jump-dept="whitelist">Citizen Entry Ticket</a></li>
            <li><a href="#applications" data-jump-dept="police">Police Dept (LSPD)</a></li>
            <li><a href="#applications" data-jump-dept="ems">Emergency Services</a></li>
            <li><a href="#applications" data-jump-dept="mechanic">Mechanic Garage</a></li>
            <li><a href="#applications" data-jump-dept="staff">Staff Applications</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>COMMUNITY & SECURITY</h4>
          <ul class="footer-links">
            <li><a href="https://discord.com/invite/bZ2YpSrq8" target="_blank">Discord Server</a></li>
            <li><a href="#rules">City Penal Code</a></li>
            <li><a href="#rules">Voice Chat Rules</a></li>
            <li><a href="javascript:void(0)" id="footer-tracker-link">Track Application</a></li>
            <li><a href="javascript:void(0)" id="footer-staff-login-btn" class="staff-portal-trigger-link">🔒 Staff Portal Login</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          &copy; 2026 NEW ERA ROLEPLAY COMMUNITY. All Rights Reserved. Not affiliated with Rockstar Games or Take-Two Interactive.
        </div>
        <div style="display: flex; gap: 1.5rem; align-items: center;">
          <span style="color: var(--text-dim); font-size: 0.8rem;">SERVER VERSION: V2.4-STABLE</span>
          <a href="javascript:void(0)" id="discrete-staff-link" style="color: var(--text-dim); font-size: 0.8rem; text-decoration: none;" title="Staff Terminal Access">🛡️ Staff Access</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- ==========================================================================
       DEDICATED FULLSCREEN STAFF & ADMIN MANAGEMENT PORTAL (Hidden from Clients)
       ========================================================================== -->
  <div class="staff-portal-modal-overlay" id="staff-portal-modal" style="display: none;">
    <div class="staff-portal-wrapper">
      
      <!-- Screen 1: Staff Authentication Lockscreen -->
      <div class="staff-login-card" id="staff-login-card">
        <button type="button" class="portal-close-corner-btn" id="btn-close-staff-portal" title="Return to Website">✕</button>
        <div class="staff-lock-icon-wrap">
          <img src="assets/logo.png" alt="New Era Logo" style="width: 64px; height: 64px; margin-bottom: 0.5rem;">
          <div class="lock-shield">🔒</div>
        </div>
        <h2 class="portal-login-title">NEW ERA STAFF PORTAL</h2>
        <p class="portal-login-sub">Restricted Administrative Console. Verify your authorized Discord Role or enter master credentials to access city management.</p>
        
        <!-- Auth Method Selector Tabs -->
        <div class="auth-tabs-toggle">
          <button type="button" class="auth-tab-btn active" id="auth-tab-btn-discord">
            <span>💬 DISCORD ROLE LOGIN</span>
          </button>
          <button type="button" class="auth-tab-btn" id="auth-tab-btn-passcode">
            <span>🔑 MASTER PASSCODE</span>
          </button>
        </div>

        <!-- Mode A: Discord Role Verification / Login -->
        <div id="auth-mode-discord-wrap">
          <form id="staff-discord-login-form">
            <div class="form-group" style="margin-bottom: 1rem; text-align: left;">
              <label style="font-size: 0.82rem;">Discord User ID or Username <span class="req">*</span></label>
              <input type="text" class="form-control" id="staff-discord-id-input" placeholder="e.g. 1424089623344451807 or Viper#1337" style="text-align: center; font-size: 1rem;" required>
              <small style="color: var(--text-dim); display: block; margin-top: 4px; font-size: 0.74rem;">Checks permissions against Discord Roles configured in the Admin Console.</small>
            </div>

            <div class="form-group" style="margin-bottom: 1.2rem; text-align: left;">
              <label style="font-size: 0.82rem;">Select Authorized Role Profile</label>
              <select class="form-control" id="staff-role-select-preset" style="font-size: 0.88rem;">
                <option value="drole-1">👑 Server Owner / Founder (Master Admin)</option>
                <option value="drole-2">🛡️ Head Administrator (Operations)</option>
                <option value="drole-3">👮 Police High Command (LSPD Dept Review)</option>
                <option value="drole-4">🚑 Medical Chief (EMS Dept Review)</option>
              </select>
            </div>

            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.95rem; background: #5865f2; border-color: #5865f2;">
              <span>⚡ VERIFY DISCORD ROLE & LOGIN</span>
            </button>
          </form>
        </div>

        <!-- Mode B: Passcode Form -->
        <div id="auth-mode-passcode-wrap" style="display: none;">
          <form id="staff-login-form">
            <div class="form-group" style="margin-bottom: 1.2rem; text-align: left;">
              <label style="font-size: 0.82rem;">Staff Passcode / Master Key</label>
              <input type="password" class="form-control" id="staff-passcode-input" placeholder="Enter Staff Passcode" style="text-align: center; letter-spacing: 3px; font-size: 1.1rem;">
            </div>
            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 1rem;">
              <span>UNLOCK DASHBOARD</span>
            </button>
          </form>
          <p class="login-hint-text" style="margin-top: 0.8rem;">Default Key: <code>newera2026</code> (Changeable in Settings)</p>
        </div>

      </div>

      <!-- Screen 2: Full Management Console Dashboard -->
      <div class="staff-console-card" id="staff-console-card" style="display: none;">
        <!-- Top Console Header with Integrated Website Navigator -->
        <header class="staff-console-header">
          <div class="console-brand-left">
            <img src="assets/logo.png" alt="Logo" class="console-logo">
            <div>
              <div class="console-title">NEW ERA <span>MANAGEMENT CONSOLE</span></div>
              <div class="console-subtitle">Roleplay Server Administration & Registry Database</div>
            </div>
          </div>

          <!-- Public Website Quick Navigator (Available on Every Tab!) -->
          <div class="console-web-nav">
            <span class="web-nav-label">WEBSITE NAV:</span>
            <button type="button" class="btn-console-nav-home" id="btn-console-home-top" title="Go to Website Home">
              <span>🏠 Home</span>
            </button>
            <button type="button" class="btn-console-nav-link" onclick="closePortalAndScroll('#status-section')">
              <span>📊 Status</span>
            </button>
            <button type="button" class="btn-console-nav-link" onclick="closePortalAndScroll('#applications')">
              <span>🎫 Tickets</span>
            </button>
            <button type="button" class="btn-console-nav-link" onclick="closePortalAndScroll('#rules')">
              <span>📜 Rules</span>
            </button>
            <button type="button" class="btn-console-nav-link" onclick="closePortalAndScroll('#staff')">
              <span>👥 Staff</span>
            </button>
          </div>

          <div class="console-header-right">
            <!-- Dynamic Authenticated User & Discord Role Badge -->
            <div class="console-badge-pill" id="console-user-profile-badge">
              <span class="pulse-dot"></span>
              <span id="staff-active-user-name">Staff Admin</span>
              <span style="opacity: 0.6;">|</span>
              <span id="staff-active-role" style="color: var(--cyan); font-weight: 800;">HEAD ADMINISTRATOR</span>
            </div>
            <div class="console-clock" id="staff-console-clock">00:00:00</div>
            <button type="button" class="btn-primary" id="btn-portal-back-to-site" style="padding: 0.55rem 1.1rem; font-size: 0.85rem; font-weight: 700; background: linear-gradient(135deg, var(--cyan), var(--primary)); color: #000; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <span>🏠 BACK TO WEBSITE</span>
            </button>
            <button type="button" class="btn-glass" id="btn-staff-logout" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; color: #ff4757; border-color: rgba(255,71,87,0.4);">
              <span>🚪 LOGOUT</span>
            </button>
            <button type="button" class="portal-close-top-btn" id="btn-console-exit-btn" title="Exit Console & Return to Home">✕</button>
          </div>
        </header>

        <!-- Console Tab Navigation -->
        <nav class="console-nav-tabs">
          <button class="console-tab-btn active" data-tab="applications">
            <span class="tab-icon">📋</span>
            <span>Entry Tickets Database</span>
            <span class="tab-counter-badge" id="tab-badge-pending">0</span>
          </button>
          <button class="console-tab-btn" data-tab="rules">
            <span class="tab-icon">📜</span>
            <span>Rules Manager</span>
          </button>
          <button class="console-tab-btn" data-tab="questions">
            <span class="tab-icon">🏢</span>
            <span>Departments & Questions</span>
          </button>
          <button class="console-tab-btn" data-tab="discord">
            <span class="tab-icon">🤖</span>
            <span>Discord Routing & Roles</span>
            <span class="tab-counter-badge" id="tab-badge-discord-routes" style="background: #5865f2; color: #fff;">6</span>
          </button>
          <button class="console-tab-btn" data-tab="features">
            <span class="tab-icon">🌟</span>
            <span>Features Manager</span>
          </button>
          <button class="console-tab-btn" data-tab="staff">
            <span class="tab-icon">👥</span>
            <span>Staff Team Manager</span>
          </button>
          <button class="console-tab-btn" data-tab="settings">
            <span class="tab-icon">⚙️</span>
            <span>Server & Connections</span>
          </button>
        </nav>

        <!-- Tab Content Container -->
        <main class="console-tab-body">
          
          <!-- TAB 1: APPLICATIONS DATABASE -->
          <div class="console-tab-panel active" id="tab-panel-applications">
            <!-- Stats Row -->
            <div class="admin-stats-row">
              <div class="admin-stat-card">
                <div class="val" id="stat-total-apps" style="color: var(--cyan);">0</div>
                <div class="lbl">TOTAL SUBMISSIONS</div>
              </div>
              <div class="admin-stat-card">
                <div class="val" id="stat-pending-apps" style="color: #ffa502;">0</div>
                <div class="lbl">PENDING REVIEW</div>
              </div>
              <div class="admin-stat-card">
                <div class="val" id="stat-approved-apps" style="color: #2ed573;">0</div>
                <div class="lbl">ACCEPTED CITIZENS</div>
              </div>
              <div class="admin-stat-card">
                <div class="val" id="stat-rejected-apps" style="color: #ff4757;">0</div>
                <div class="lbl">REJECTED</div>
              </div>
            </div>

                        <!-- Subnav Pages / Filter Tabs -->
            <div class="db-subnav-bar">
              <div class="db-subnav-group" id="db-subnav-group">
                <button type="button" class="db-subnav-btn active" data-subview="pending">
                  <span>⏳ Pending Queue</span>
                  <span class="db-pill-count" id="pill-count-pending">0</span>
                </button>
                <button type="button" class="db-subnav-btn" data-subview="approved">
                  <span>✅ Accepted Citizens</span>
                  <span class="db-pill-count" id="pill-count-approved">0</span>
                </button>
                <button type="button" class="db-subnav-btn" data-subview="rejected">
                  <span>❌ Rejected</span>
                  <span class="db-pill-count" id="pill-count-rejected">0</span>
                </button>
                <button type="button" class="db-subnav-btn" data-subview="departments">
                  <span>📁 By Department</span>
                </button>
                <button type="button" class="db-subnav-btn" data-subview="all">
                  <span>📊 Master Registry</span>
                  <span class="db-pill-count" id="pill-count-all">0</span>
                </button>
              </div>
            </div>

            <!-- Department Category Chips (Visible when By Department is selected) -->
            <div class="db-dept-chips" id="db-dept-chips" style="display: none;">
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan); align-self: center; margin-right: 0.5rem;">FILTER DEPT:</span>
              <button type="button" class="dept-chip-btn active" data-dept-filter="all">All Departments (<span id="dept-count-all">0</span>)</button>
              <button type="button" class="dept-chip-btn" data-dept-filter="whitelist">🎫 Citizen Entry (<span id="dept-count-whitelist">0</span>)</button>
              <button type="button" class="dept-chip-btn" data-dept-filter="police">👮 Police Dept (<span id="dept-count-police">0</span>)</button>
              <button type="button" class="dept-chip-btn" data-dept-filter="ems">🚑 EMS Hospital (<span id="dept-count-ems">0</span>)</button>
              <button type="button" class="dept-chip-btn" data-dept-filter="mechanic">🛠️ Mechanic (<span id="dept-count-mechanic">0</span>)</button>
              <button type="button" class="dept-chip-btn" data-dept-filter="staff">⚖️ Staff (<span id="dept-count-staff">0</span>)</button>
              <button type="button" class="dept-chip-btn" data-dept-filter="business">💼 Gangs & Biz (<span id="dept-count-business">0</span>)</button>
            </div>

            <!-- Toolbar Controls -->
            <div class="database-toolbar">
              <div class="search-box-wrap">
                <input type="text" class="form-control" id="db-search-input" placeholder="Search by Ticket ID, Discord, Character Name, Steam...">
              </div>
              <div class="filter-controls-group">
                <select class="form-control" id="db-filter-status" style="width: auto;">
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <select class="form-control" id="db-filter-dept" style="width: auto;">
                  <option value="all">All Departments</option>
                  <option value="whitelist">Citizen Entry Ticket</option>
                  <option value="police">Police Dept</option>
                  <option value="ems">EMS</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="staff">Staff Application</option>
                  <option value="business">Gang & Business</option>
                </select>
                <button type="button" class="btn-glass" id="btn-export-db-json" title="Export Applications to JSON">📥 Export JSON</button>
                <button type="button" class="btn-glass" id="btn-export-db-csv" title="Export to CSV Spreadsheet">📊 Export CSV</button>
                <button type="button" class="btn-glass" id="btn-seed-test-app" title="Add Test Application for testing">+ Test Application</button>
              </div>
            </div>

            <!-- Clean Table View -->
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>TICKET ID</th>
                    <th>CHARACTER / APPLICANT</th>
                    <th>DISCORD & STEAM</th>
                    <th>DEPARTMENT</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody id="db-table-body">
                  <!-- Dynamically populated by app.js -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 2: RULES MANAGER -->
          <div class="console-tab-panel" id="tab-panel-rules">
            <div class="tab-header-flex">
              <div>
                <h3 class="panel-heading">SERVER RULES EDITOR</h3>
                <p class="panel-sub">Add, edit, or delete roleplay guidelines. Edits are immediately updated on the public rules section.</p>
              </div>
              <button class="btn-primary" id="btn-open-add-rule-form">+ ADD NEW RULE</button>
            </div>

            <!-- Add/Edit Rule Inline Card -->
            <div class="management-inline-card" id="rule-edit-form-wrap" style="display: none;">
              <h4 id="rule-form-title" style="color: var(--cyan); margin-bottom: 1rem;">ADD NEW SERVER RULE</h4>
              <form id="form-manage-rule">
                <input type="hidden" id="rule-edit-id">
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Rule Title <span class="req">*</span></label>
                    <input type="text" class="form-control" id="rule-input-title" placeholder="e.g. Rule 1.1: Value of Life (Fear RP)" required>
                  </div>
                  <div class="form-group">
                    <label>Category <span class="req">*</span></label>
                    <select class="form-control" id="rule-input-category" required>
                      <option value="general">General RP</option>
                      <option value="combat">Combat & Crimes</option>
                      <option value="robbery">Robberies</option>
                      <option value="safezone">Safe Zones</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label>Rule Description & Consequences <span class="req">*</span></label>
                  <textarea class="form-control" id="rule-input-desc" style="min-height: 100px;" placeholder="Full details of this rule and examples of violations..." required></textarea>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                  <button type="button" class="btn-glass" id="btn-cancel-rule-form">CANCEL</button>
                  <button type="submit" class="btn-primary">SAVE RULE</button>
                </div>
              </form>
            </div>

            <!-- Rules List Table -->
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>CATEGORY</th>
                    <th>RULE TITLE</th>
                    <th>DESCRIPTION</th>
                    <th style="width: 140px;">ACTIONS</th>
                  </tr>
                </thead>
                <tbody id="rules-manager-table-body">
                  <!-- Populated dynamically -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 3: QUESTIONS MANAGER -->
          <div class="console-tab-panel" id="tab-panel-questions">
            <!-- SECTION 1: DEPARTMENTS MANAGEMENT -->
            <div class="tab-header-flex">
              <div>
                <h3 class="panel-heading">APPLICATION DEPARTMENTS MANAGER</h3>
                <p class="panel-sub">Add, edit, or delete roleplay departments and citizen application streams.</p>
              </div>
              <button type="button" class="btn-primary" id="btn-open-add-dept-form">+ ADD NEW DEPARTMENT</button>
            </div>

            <!-- Add/Edit Department Form -->
            <div class="management-inline-card" id="dept-edit-form-wrap" style="display: none; margin-bottom: 2rem;">
              <h4 id="dept-form-title" style="color: var(--cyan); margin-bottom: 1rem;">ADD ROLEPLAY DEPARTMENT</h4>
              <form id="form-manage-dept">
                <input type="hidden" id="dept-edit-id">
                <div style="display: grid; grid-template-columns: 1fr 2fr 100px; gap: 1rem;">
                  <div class="form-group">
                    <label>Department Code / ID <span class="req">*</span></label>
                    <input type="text" class="form-control" id="dept-input-id" placeholder="e.g. taxi or court" required>
                  </div>
                  <div class="form-group">
                    <label>Department Display Name <span class="req">*</span></label>
                    <input type="text" class="form-control" id="dept-input-name" placeholder="e.g. Downtown Cab Co. or Judicial Dept" required>
                  </div>
                  <div class="form-group">
                    <label>Badge Icon</label>
                    <input type="text" class="form-control" id="dept-input-icon" placeholder="e.g. 🚖" value="📋">
                  </div>
                </div>
                <div class="form-group">
                  <label>Header Title (In Application Modal) <span class="req">*</span></label>
                  <input type="text" class="form-control" id="dept-input-title" placeholder="e.g. Downtown Cab Co. Driver Recruitment" required>
                </div>
                <div class="form-group">
                  <label>Description / Requirements</label>
                  <textarea class="form-control" id="dept-input-desc" placeholder="Briefly describe the department and requirements for applicants..."></textarea>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                  <button type="button" class="btn-glass" id="btn-cancel-dept-form">CANCEL</button>
                  <button type="submit" class="btn-primary">SAVE DEPARTMENT</button>
                </div>
              </form>
            </div>

            <!-- Departments Table -->
            <div class="table-responsive" style="margin-bottom: 2.5rem;">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>ICON</th>
                    <th>DEPARTMENT NAME</th>
                    <th>CODE</th>
                    <th>APPLICATION TITLE & DESCRIPTION</th>
                    <th style="width: 140px;">ACTIONS</th>
                  </tr>
                </thead>
                <tbody id="depts-manager-table-body">
                  <!-- Populated dynamically -->
                </tbody>
              </table>
            </div>

            <hr style="border: none; border-top: 1px solid var(--border-glass); margin: 2rem 0;">

            <!-- SECTION 2: SCENARIO QUESTIONS MANAGEMENT -->
            <div class="tab-header-flex">
              <div>
                <h3 class="panel-heading">SCENARIO QUESTIONS MANAGER</h3>
                <p class="panel-sub">Customize the scenario evaluation questions for each department in Stage 3.</p>
              </div>
              <div style="display: flex; gap: 0.8rem; align-items: center;">
                <select class="form-control" id="filter-questions-by-dept" style="width: 220px; font-size: 0.85rem;">
                  <option value="all">Filter: All Departments</option>
                </select>
                <button type="button" class="btn-primary" id="btn-open-add-question-form">+ ADD NEW QUESTION</button>
              </div>
            </div>

            <!-- Add/Edit Question Form -->
            <div class="management-inline-card" id="question-edit-form-wrap" style="display: none;">
              <h4 id="question-form-title" style="color: var(--cyan); margin-bottom: 1rem;">ADD SCENARIO QUESTION</h4>
              <form id="form-manage-question">
                <input type="hidden" id="question-edit-id">
                <div class="form-group">
                  <label>Assign to Department <span class="req">*</span></label>
                  <select class="form-control" id="question-input-dept" required>
                    <option value="all">All Departments (General Rule)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Question Prompt / Scenario Description <span class="req">*</span></label>
                  <input type="text" class="form-control" id="question-input-prompt" placeholder="e.g. Define Powergaming and give an in-game example." required>
                </div>
                <div class="form-group">
                  <label>Placeholder Text for Applicant</label>
                  <input type="text" class="form-control" id="question-input-placeholder" placeholder="e.g. Explain why forcing an outcome is forbidden...">
                </div>
                <div class="form-group">
                  <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" id="question-input-required" checked>
                    <span>Required Question</span>
                  </label>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                  <button type="button" class="btn-glass" id="btn-cancel-question-form">CANCEL</button>
                  <button type="submit" class="btn-primary">SAVE QUESTION</button>
                </div>
              </form>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>QUESTION PROMPT</th>
                    <th>DEPARTMENT</th>
                    <th>REQUIRED</th>
                    <th style="width: 140px;">ACTIONS</th>
                  </tr>
                </thead>
                <tbody id="questions-manager-table-body">
                  <!-- Populated dynamically -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 4: FEATURES MANAGER -->
          <div class="console-tab-panel" id="tab-panel-features">
            <div class="tab-header-flex">
              <div>
                <h3 class="panel-heading">CITY FEATURES & HIGHLIGHTS</h3>
                <p class="panel-sub">Manage the features displayed in the "Why Choose New Era" public section.</p>
              </div>
              <button class="btn-primary" id="btn-open-add-feature-form">+ ADD FEATURE</button>
            </div>

            <!-- Add/Edit Feature Form -->
            <div class="management-inline-card" id="feature-edit-form-wrap" style="display: none;">
              <h4 id="feature-form-title" style="color: var(--cyan); margin-bottom: 1rem;">ADD NEW FEATURE</h4>
              <form id="form-manage-feature">
                <input type="hidden" id="feature-edit-id">
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Feature Icon (Emoji or SVG) <span class="req">*</span></label>
                    <input type="text" class="form-control" id="feature-input-icon" placeholder="e.g. 🏎️ or 💼" required>
                  </div>
                  <div class="form-group">
                    <label>Feature Title <span class="req">*</span></label>
                    <input type="text" class="form-control" id="feature-input-title" placeholder="e.g. 600+ Custom Import Cars" required>
                  </div>
                </div>
                <div class="form-group">
                  <label>Feature Description <span class="req">*</span></label>
                  <textarea class="form-control" id="feature-input-desc" placeholder="Explain this feature for players..." required></textarea>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                  <button type="button" class="btn-glass" id="btn-cancel-feature-form">CANCEL</button>
                  <button type="submit" class="btn-primary">SAVE FEATURE</button>
                </div>
              </form>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>ICON</th>
                    <th>TITLE</th>
                    <th>DESCRIPTION</th>
                    <th style="width: 140px;">ACTIONS</th>
                  </tr>
                </thead>
                <tbody id="features-manager-table-body">
                  <!-- Populated dynamically -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 5: STAFF TEAM MANAGER -->
          <div class="console-tab-panel" id="tab-panel-staff">
            <div class="tab-header-flex">
              <div>
                <h3 class="panel-heading">STAFF TEAM MANAGEMENT</h3>
                <p class="panel-sub">Add your actual staff members, update roles, or delete outdated names. Changes update the public staff section instantly.</p>
              </div>
              <button class="btn-primary" id="btn-open-add-staff-form">+ ADD STAFF MEMBER</button>
            </div>

            <!-- Add/Edit Staff Form -->
            <div class="management-inline-card" id="staff-edit-form-wrap" style="display: none;">
              <h4 id="staff-form-title" style="color: var(--cyan); margin-bottom: 1rem;">ADD STAFF MEMBER</h4>
              <form id="form-manage-staff">
                <input type="hidden" id="staff-edit-id">
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Staff Name <span class="req">*</span></label>
                    <input type="text" class="form-control" id="staff-input-name" placeholder="e.g. Dilum (Viper) or Master Admin" required>
                  </div>
                  <div class="form-group">
                    <label>Staff Role / Title <span class="req">*</span></label>
                    <input type="text" class="form-control" id="staff-input-role" placeholder="e.g. Founder & Server Owner" required>
                  </div>
                </div>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Discord Tag <span class="req">*</span></label>
                    <input type="text" class="form-control" id="staff-input-discord" placeholder="e.g. Viper#0001 or viper_official" required>
                  </div>
                  <div class="form-group">
                    <label>Avatar Image Path or URL</label>
                    <input type="text" class="form-control" id="staff-input-avatar" placeholder="assets/logo.png or image URL">
                  </div>
                </div>
                <div class="form-group">
                  <label>Role Bio / Responsibilities</label>
                  <textarea class="form-control" id="staff-input-bio" placeholder="Short description of this staff member's responsibilities..."></textarea>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                  <button type="button" class="btn-glass" id="btn-cancel-staff-form">CANCEL</button>
                  <button type="submit" class="btn-primary">SAVE STAFF MEMBER</button>
                </div>
              </form>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>AVATAR</th>
                    <th>NAME</th>
                    <th>ROLE</th>
                    <th>DISCORD</th>
                    <th>BIO</th>
                    <th style="width: 140px;">ACTIONS</th>
                  </tr>
                </thead>
                <tbody id="staff-manager-table-body">
                  <!-- Populated dynamically -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 6: SERVER & DISCORD CONNECTIONS -->
          <div class="console-tab-panel" id="tab-panel-settings">
            <h3 class="panel-heading" style="margin-bottom: 0.5rem;">FIVEM SERVER & DISCORD INTEGRATIONS</h3>
            <p class="panel-sub" style="margin-bottom: 2rem;">Configure live FiveM server connection parameters, Discord invitations, and automated application webhook triggers.</p>

            <form id="form-server-settings">
              <div class="settings-grid">
                
                <!-- FiveM Connection Box -->
                <div class="settings-card">
                  <h4 class="settings-card-title">🎮 FIVEM SERVER CONFIGURATION</h4>
                  <div class="form-group">
                    <label>Server Name / Community Title</label>
                    <input type="text" class="form-control" id="cfg-server-name" value="NEW ERA ROLEPLAY COMMUNITY">
                  </div>
                  <div class="form-group">
                    <label>CFX.re Join Link / Endpoint</label>
                    <input type="text" class="form-control" id="cfg-cfx-join" value="cfx.re/join/newera">
                  </div>
                  <div class="form-group">
                    <label>Direct IP & Port (F8 Connect)</label>
                    <input type="text" class="form-control" id="cfg-direct-ip" value="103.155.220.45:30120">
                  </div>
                  <div class="form-grid-2">
                    <div class="form-group">
                      <label>Active Citizens (Current)</label>
                      <input type="number" class="form-control" id="cfg-active-players" value="118">
                    </div>
                    <div class="form-group">
                      <label>Max Slots</label>
                      <input type="number" class="form-control" id="cfg-max-slots" value="128">
                    </div>
                  </div>
                  <div class="form-grid-2">
                    <div class="form-group">
                      <label>Queue Count</label>
                      <input type="text" class="form-control" id="cfg-queue-count" value="14 IN LINE">
                    </div>
                    <div class="form-group">
                      <label>Server Uptime</label>
                      <input type="text" class="form-control" id="cfg-uptime" value="99.98% (24h 10m)">
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Server Status State</label>
                    <select class="form-control" id="cfg-server-status">
                      <option value="ONLINE">ONLINE (Normal Operations)</option>
                      <option value="RESTARTING">RESTARTING (Daily Reset)</option>
                      <option value="MAINTENANCE">MAINTENANCE (Patch Deployment)</option>
                    </select>
                  </div>
                </div>

                <!-- Discord & Security Box -->
                <div class="settings-card">
                  <h4 class="settings-card-title">💬 DISCORD INTEGRATION & WEBHOOKS</h4>
                  <div class="form-group">
                    <label>Discord Server Invite Link</label>
                    <input type="text" class="form-control" id="cfg-discord-invite" value="https://discord.com/invite/bZ2YpSrq8">
                  </div>
                  <div class="form-group">
                    <label>Discord Staff Alert Webhook URL</label>
                    <div style="display: flex; gap: 0.6rem;">
                      <input type="url" class="form-control" id="cfg-discord-webhook" placeholder="https://discord.com/api/webhooks/xxxx/xxxx" style="flex: 1;">
                      <button type="button" class="btn-glass" id="btn-test-webhook" style="white-space: nowrap; padding: 0.6rem 1rem;">📢 TEST WEBHOOK</button>
                    </div>
                    <small style="color: var(--text-dim); display: block; margin-top: 5px;">Sends automated embed announcements whenever an Entry Ticket is submitted, approved, rejected, or pending!</small>
                  </div>

                  <h4 class="settings-card-title" style="margin-top: 2rem;">🔒 STAFF SECURITY CREDENTIALS</h4>
                  <div class="form-group">
                    <label>Master Staff Passcode</label>
                    <input type="password" class="form-control" id="cfg-admin-passcode" value="newera2026">
                    <small style="color: var(--text-dim); display: block; margin-top: 5px;">Key required to unlock this Staff Management Console.</small>
                  </div>

                  <div style="margin-top: 2rem;">
                    <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 1rem;">
                      <span>💾 SAVE ALL CONFIGURATIONS</span>
                    </button>
                  </div>
                </div>

              </div>
            </form>
          </div>

          <!-- TAB 7: DISCORD AUTOMATION, CHANNELS & ROLE-BASED ACCESS CONTROL (RBAC) -->
          <div class="console-tab-panel" id="tab-panel-discord">
            <div class="tab-header-flex">
              <div>
                <h3 class="panel-heading">DISCORD AUTOMATION, CHANNELS & RBAC PERMISSIONS</h3>
                <p class="panel-sub">Manage department-specific Discord announcement channels, automated entry ticket dispatching, staff role permissions, and customized response templates.</p>
              </div>
            </div>

            <!-- Sub-Navigation Bar for Discord Module -->
            <div class="discord-subnav-group" id="discord-subnav-group">
              <button type="button" class="discord-subnav-btn active" data-disc-sub="routes">
                <span>📡 Department Channel Routing</span>
                <span class="db-pill-count" id="pill-count-routes">6</span>
              </button>
              <button type="button" class="discord-subnav-btn" data-disc-sub="roles">
                <span>🛡️ Discord Roles & RBAC</span>
                <span class="db-pill-count" id="pill-count-roles">4</span>
              </button>
              <button type="button" class="discord-subnav-btn" data-disc-sub="templates">
                <span>💬 Response & Message Customizer</span>
              </button>
              <button type="button" class="discord-subnav-btn" data-disc-sub="api">
                <span>⚙️ Discord API & Gate Settings</span>
              </button>
            </div>

            <!-- SUBMODULE 1: DEPARTMENT CHANNEL ROUTING -->
            <div class="disc-subpanel active" id="disc-subpanel-routes">
              <div class="tab-header-flex">
                <div>
                  <h4 style="color: var(--cyan); font-family: var(--font-heading); font-size: 1.15rem; margin-bottom: 0.3rem;">DEPARTMENT CHANNEL ROUTING</h4>
                  <p class="panel-sub">Each department (Entry Ticket, Police, EMS, Mechanic, Staff, etc.) routes to its own Discord channel and webhook.</p>
                </div>
                <button type="button" class="btn-primary" id="btn-open-add-route-form">+ ADD DEPARTMENT ROUTE</button>
              </div>

              <!-- Add/Edit Route Form Card -->
              <div class="management-inline-card" id="route-edit-form-wrap" style="display: none; margin-bottom: 2rem;">
                <h4 id="route-form-title" style="color: var(--cyan); margin-bottom: 1rem;">CONFIGURE DEPARTMENT CHANNEL ROUTE</h4>
                <form id="form-manage-discord-route">
                  <input type="hidden" id="route-edit-id">
                  <div class="form-grid-2">
                    <div class="form-group">
                      <label>Select Department <span class="req">*</span></label>
                      <select class="form-control" id="route-input-dept" required>
                        <!-- Loaded dynamically from DataStore.getDepartments() -->
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Discord Channel Name <span class="req">*</span></label>
                      <input type="text" class="form-control" id="route-input-channel" placeholder="e.g. #citizen-tickets or #lspd-recruitment" required>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Discord Webhook URL for this Channel <span class="req">*</span></label>
                    <input type="url" class="form-control" id="route-input-webhook" placeholder="https://discord.com/api/webhooks/123456789/xxxx" required>
                    <small style="color: var(--text-dim); display: block; margin-top: 4px;">Paste the specific Discord channel webhook where application updates will be posted.</small>
                  </div>

                  <div class="form-grid-2">
                    <div class="form-group">
                      <label>Ping Role ID (Optional Department Role)</label>
                      <input type="text" class="form-control" id="route-input-role-id" placeholder="e.g. 1424089623344451807 or leave empty">
                      <small style="color: var(--text-dim); display: block; margin-top: 4px;">Automatically pings &lt;@&amp;RoleID&gt; when a submission or review occurs.</small>
                    </div>
                    <div class="form-group" style="display: flex; flex-direction: column; justify-content: center; gap: 0.8rem; margin-top: 1.2rem;">
                      <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                        <input type="checkbox" id="route-input-ping-user" checked>
                        <span>Ping Applicant (&lt;@ApplicantID&gt;)</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                        <input type="checkbox" id="route-input-send-pass" checked>
                        <span>Attach Entry Ticket Pass Image (PNG)</span>
                      </label>
                    </div>
                  </div>

                  <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="button" class="btn-glass" id="btn-cancel-route-form">CANCEL</button>
                    <button type="submit" class="btn-primary">SAVE CHANNEL ROUTE</button>
                  </div>
                </form>
              </div>

              <!-- Channel Routes Table -->
              <div class="table-responsive">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>DEPARTMENT</th>
                      <th>DISCORD CHANNEL</th>
                      <th>WEBHOOK STATUS</th>
                      <th>MENTION ROLE</th>
                      <th>PASS ATTACHMENT</th>
                      <th style="width: 190px;">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody id="discord-routes-table-body">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SUBMODULE 2: DISCORD ROLES & RBAC -->
            <div class="disc-subpanel" id="disc-subpanel-roles" style="display: none;">
              <div class="tab-header-flex">
                <div>
                  <h4 style="color: var(--cyan); font-family: var(--font-heading); font-size: 1.15rem; margin-bottom: 0.3rem;">DISCORD ROLES & ACCESS PERMISSIONS</h4>
                  <p class="panel-sub">Authorize Discord Role IDs to access the Admin Console with full administrative control or department-restricted access.</p>
                </div>
                <button type="button" class="btn-primary" id="btn-open-add-role-form">+ ADD DISCORD ROLE</button>
              </div>

              <!-- Add/Edit Role Form Card -->
              <div class="management-inline-card" id="role-edit-form-wrap" style="display: none; margin-bottom: 2rem;">
                <h4 id="role-form-title" style="color: var(--cyan); margin-bottom: 1rem;">ADD DISCORD ROLE PERMISSION</h4>
                <form id="form-manage-discord-role">
                  <input type="hidden" id="drole-edit-id">
                  <div class="form-grid-2">
                    <div class="form-group">
                      <label>Role Display Name <span class="req">*</span></label>
                      <input type="text" class="form-control" id="drole-input-name" placeholder="e.g. Police High Command or Whitelist Reviewer" required>
                    </div>
                    <div class="form-group">
                      <label>Discord Role ID <span class="req">*</span></label>
                      <input type="text" class="form-control" id="drole-input-id" placeholder="e.g. 134100000000000003" required>
                    </div>
                  </div>

                  <div class="form-grid-2">
                    <div class="form-group">
                      <label>Role Accent Color</label>
                      <input type="color" class="form-control" id="drole-input-color" value="#00eaff" style="height: 44px; padding: 2px;">
                    </div>
                    <div class="form-group">
                      <label>Department Scope / Restriction</label>
                      <select class="form-control" id="drole-input-dept">
                        <option value="all">Global (All Departments)</option>
                        <!-- Loaded dynamically -->
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label style="margin-bottom: 0.6rem; display: block;">Authorized Permissions:</label>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.6rem; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px;">
                      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" id="drole-perm-all">
                        <span style="font-weight: 700; color: var(--cyan);">👑 Master Admin (All Access)</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" id="drole-perm-tickets" checked>
                        <span>📋 Review / Approve Tickets</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" id="drole-perm-rules">
                        <span>📜 Edit Server Rules</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" id="drole-perm-depts">
                        <span>🏢 Edit Departments & Questions</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" id="drole-perm-staff">
                        <span>👥 Manage Staff List</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" id="drole-perm-discord">
                        <span>🤖 Configure Discord Routing</span>
                      </label>
                    </div>
                  </div>

                  <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="button" class="btn-glass" id="btn-cancel-role-form">CANCEL</button>
                    <button type="submit" class="btn-primary">SAVE DISCORD ROLE</button>
                  </div>
                </form>
              </div>

              <!-- Roles Table -->
              <div class="table-responsive">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>ROLE NAME</th>
                      <th>DISCORD ROLE ID</th>
                      <th>SCOPE / DEPT</th>
                      <th>PERMISSIONS</th>
                      <th style="width: 140px;">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody id="discord-roles-table-body">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SUBMODULE 3: RESPONSE & MESSAGE CUSTOMIZER -->
            <div class="disc-subpanel" id="disc-subpanel-templates" style="display: none;">
              <h4 style="color: var(--cyan); font-family: var(--font-heading); font-size: 1.15rem; margin-bottom: 0.3rem;">DISCORD RESPONSE & MESSAGE CUSTOMIZER</h4>
              <p class="panel-sub" style="margin-bottom: 1.5rem;">Customize message texts, staff remarks, embed colors, and bot credentials for all automatic announcements.</p>

              <div class="form-grid-2" style="align-items: flex-start; gap: 2rem;">
                <!-- Form Column -->
                <div>
                  <form id="form-discord-templates">
                    <div class="form-group">
                      <label>Default Staff Remarks on Ticket Pass <span class="req">*</span></label>
                      <input type="text" class="form-control" id="tmpl-staff-remarks" value="WELCOME TO NEW ERA ROLEPLAY COMMUNITY" required>
                      <small style="color: var(--text-dim); display: block; margin-top: 4px;">Rendered on the left side of the high-res boarding pass pass canvas.</small>
                    </div>

                    <div class="form-grid-2">
                      <div class="form-group">
                        <label>Discord Bot Username</label>
                        <input type="text" class="form-control" id="tmpl-bot-name" value="New Era Entry Gateway">
                      </div>
                      <div class="form-group">
                        <label>Discord Bot Avatar URL</label>
                        <input type="text" class="form-control" id="tmpl-bot-avatar" value="assets/logo.png">
                      </div>
                    </div>

                    <div class="form-group">
                      <label>Approved Announcement Message Format</label>
                      <textarea class="form-control" id="tmpl-msg-approved" style="min-height: 90px;">{mention}, Your whitelist application has been **ACCEPTED** ✅.

Please check announcements for the next steps regarding your interview.

**RESULT**
**ACCEPTED** ✅</textarea>
                      <small style="color: var(--text-dim); display: block; margin-top: 4px;">Variables available: <code>{mention}</code>, <code>{status}</code>, <code>{ticket}</code>, <code>{department}</code>, <code>{character}</code></small>
                    </div>

                    <div class="form-group">
                      <label>Rejected Announcement Message Format</label>
                      <textarea class="form-control" id="tmpl-msg-rejected" style="min-height: 80px;">{mention}, Your application has been **REJECTED** ❌.

You may re-apply after 7 days following the server guidelines.

**RESULT**
**REJECTED** ❌</textarea>
                    </div>

                    <div class="form-group">
                      <label>Pending Review Message Format</label>
                      <textarea class="form-control" id="tmpl-msg-pending" style="min-height: 70px;">{mention}, Your application is currently under **PENDING REVIEW** ⏳.

Please keep your Discord DMs open for staff contact.</textarea>
                    </div>

                    <div class="form-grid-3" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                      <div class="form-group">
                        <label>Approved Color</label>
                        <input type="color" class="form-control" id="tmpl-color-approved" value="#00ff88" style="height: 40px; padding: 2px;">
                      </div>
                      <div class="form-group">
                        <label>Rejected Color</label>
                        <input type="color" class="form-control" id="tmpl-color-rejected" value="#ff4757" style="height: 40px; padding: 2px;">
                      </div>
                      <div class="form-group">
                        <label>Pending Color</label>
                        <input type="color" class="form-control" id="tmpl-color-pending" value="#ffa502" style="height: 40px; padding: 2px;">
                      </div>
                    </div>

                    <button type="submit" class="btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center; padding: 0.9rem;">
                      <span>💾 SAVE MESSAGE TEMPLATES</span>
                    </button>
                  </form>
                </div>

                <!-- Live Simulator Column -->
                <div>
                  <div style="font-family: var(--font-brand); font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>💬 LIVE DISCORD POST SIMULATOR</span>
                    <span style="font-size: 0.72rem; color: #5865f2; background: rgba(88,101,242,0.15); padding: 2px 7px; border-radius: 10px;">REALTIME PREVIEW</span>
                  </div>

                  <div class="discord-simulator-wrap">
                    <div class="discord-msg-row">
                      <img src="assets/logo.png" alt="Bot" class="discord-bot-avatar" id="sim-bot-avatar">
                      <div class="discord-msg-content">
                        <div class="discord-msg-header">
                          <span class="discord-bot-name" id="sim-bot-name">New Era Entry Gateway</span>
                          <span class="discord-bot-tag">BOT</span>
                          <span class="discord-msg-time">Today at 11:30 PM</span>
                        </div>
                        <div class="discord-msg-body" id="sim-msg-body">
                          <span class="discord-user-mention">@Applicant_User</span>, Your whitelist application has been <strong>ACCEPTED</strong> ✅.

Please check announcements for the next steps regarding your interview.

<strong>RESULT</strong>
<strong>ACCEPTED</strong> ✅
                        </div>

                        <!-- Discord Embed with Ticket Pass attachment -->
                        <div class="discord-embed-card" id="sim-embed-card">
                          <div style="font-size: 0.75rem; color: #949ba4; font-weight: 600; margin-bottom: 4px;">ATTACHED BOARDING PASS:</div>
                          <div class="discord-embed-thumb-wrap">
                            <img src="ticket_verified_clean.png" alt="Entry Pass" class="discord-embed-thumb-img">
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- SUBMODULE 4: DISCORD API & GATE SETTINGS -->
            <div class="disc-subpanel" id="disc-subpanel-api" style="display: none;">
              <h4 style="color: var(--cyan); font-family: var(--font-heading); font-size: 1.15rem; margin-bottom: 0.3rem;">DISCORD API & SECURITY GATE SETTINGS</h4>
              <p class="panel-sub" style="margin-bottom: 1.5rem;">Configure Discord Bot credentials, Server Guild ID, and determine the authentication gate for the Staff Portal.</p>

              <form id="form-discord-api-settings" style="max-width: 700px;">
                <div class="form-group">
                  <label>Staff Portal Security Gate Mode <span class="req">*</span></label>
                  <select class="form-control" id="sec-auth-mode">
                    <option value="both">Both (Discord Role Login OR Master Passcode) [Recommended]</option>
                    <option value="discord_only">Discord Role Login Only (Strict RBAC)</option>
                    <option value="passcode_only">Master Passcode Only</option>
                  </select>
                  <small style="color: var(--text-dim); display: block; margin-top: 4px;">Determines which login methods are allowed on the Staff Lockscreen.</small>
                </div>

                <div class="form-group">
                  <label>Discord Guild / Server ID <span class="req">*</span></label>
                  <input type="text" class="form-control" id="sec-guild-id" value="1424089623344451807" required>
                  <small style="color: var(--text-dim); display: block; margin-top: 4px;">Your official New Era Roleplay Discord Guild ID.</small>
                </div>

                <div class="form-group">
                  <label>Discord Application / Client ID</label>
                  <input type="text" class="form-control" id="sec-client-id" value="1424089623344451807">
                  <small style="color: var(--text-dim); display: block; margin-top: 4px;">Used for Discord OAuth2 login integration.</small>
                </div>

                <div class="form-group">
                  <label>Discord Bot Token (Optional for Live Guild Member Role Verification)</label>
                  <input type="password" class="form-control" id="sec-bot-token" placeholder="Bot token from Discord Developer Portal">
                  <small style="color: var(--text-dim); display: block; margin-top: 4px;">Optional: Enables automatic REST API verification of user roles in your Discord guild.</small>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                  <button type="button" class="btn-glass" id="btn-test-discord-guild" style="padding: 0.85rem 1.4rem;">
                    <span>🔌 TEST GUILD CONNECTION</span>
                  </button>
                  <button type="submit" class="btn-primary" style="flex: 1; justify-content: center; padding: 0.85rem;">
                    <span>💾 SAVE SECURITY SETTINGS</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

        </main>
      </div>

    </div>
  </div>

  <!-- Application Dossier Drawer / Inspection Modal -->
  <div class="dossier-modal-overlay" id="app-dossier-modal" style="display: none;">
    <div class="dossier-card">
      <div class="dossier-header">
        <div>
          <span class="dossier-tag">OFFICIAL CITIZEN REGISTRY</span>
          <h2 class="dossier-title" id="dos-char-name">Dilan Perera</h2>
          <span class="dossier-ticket-ref" id="dos-ticket-id">NET-8492-LK</span>
        </div>
        <button class="portal-close-corner-btn" id="btn-close-dossier">✕</button>
      </div>

      <div class="dossier-body">
        
        <!-- Status & Meta Bar -->
        <div class="dossier-meta-bar">
          <div><strong>Department:</strong> <span id="dos-dept">Citizen Entry Ticket</span></div>
          <div><strong>Date Applied:</strong> <span id="dos-date">2026-09-24</span></div>
          <div><strong>Current Status:</strong> <span id="dos-status-badge" class="status-badge status-pending">Pending</span></div>
        </div>

        <!-- Section 1: In-Character Persona -->
        <div class="dossier-section">
          <h4 class="dossier-section-title">👤 IN-CHARACTER DOSSIER</h4>
          <div class="dossier-field-grid">
            <div><label>Full Name:</label> <span id="dos-val-name">-</span></div>
            <div><label>Age & Gender:</label> <span id="dos-val-age-gender">-</span></div>
          </div>
          <div style="margin-top: 0.8rem;">
            <label>Character Backstory & Ambitions:</label>
            <div class="dossier-text-block" id="dos-val-backstory">-</div>
          </div>
        </div>

        <!-- Section 2: Out of Character Info -->
        <div class="dossier-section">
          <h4 class="dossier-section-title">🎮 OUT OF CHARACTER (OOC) INFO</h4>
          <div class="dossier-field-grid">
            <div>
              <label>Discord Tag:</label> 
              <span id="dos-val-discord">-</span> 
              <button class="btn-mini-copy" id="btn-copy-dos-discord">Copy</button>
            </div>
            <div>
              <label>Steam Hex / License:</label> 
              <span id="dos-val-steam">-</span> 
              <button class="btn-mini-copy" id="btn-copy-dos-steam">Copy</button>
            </div>
            <div><label>Real Age:</label> <span id="dos-val-realage">-</span></div>
            <div><label>Timezone / Hours:</label> <span id="dos-val-timezone">-</span></div>
          </div>
          <div style="margin-top: 0.8rem;">
            <label>Previous RP Experience:</label>
            <div class="dossier-text-block" id="dos-val-experience">-</div>
          </div>
        </div>

        <!-- Section 3: RP Scenario Answers -->
        <div class="dossier-section">
          <h4 class="dossier-section-title">⚖️ SCENARIO & RULE ANSWERS</h4>
          <div id="dos-scenarios-container">
            <!-- Populated dynamically -->
          </div>
        </div>

        <!-- Section 4: Staff Review Notes -->
        <div class="dossier-section" style="border-bottom: none;">
          <h4 class="dossier-section-title">📝 STAFF REVIEW NOTES</h4>
          <textarea class="form-control" id="dos-staff-notes" placeholder="Enter internal staff remarks, interview results, or reasons for rejection..."></textarea>
        </div>

      </div>

      <!-- Dossier Actions Footer -->
      <div class="dossier-footer">
        <button type="button" class="btn-approve" id="btn-dos-approve">✅ APPROVE TICKET</button>
        <button type="button" class="btn-reject" id="btn-dos-reject">❌ REJECT TICKET</button>
        <button type="button" class="btn-glass" id="btn-dos-pending">⏳ SET PENDING</button>
        <button type="button" class="btn-glass" id="btn-dos-view-pass">🎫 VIEW TICKET PASS</button>
        <button type="button" class="btn-glass" id="btn-dos-delete" style="color: #ff4757; border-color: rgba(255,71,87,0.4);">🗑️ DELETE</button>
      </div>
    </div>
  </div>

  <!-- Global Community Configuration -->
  <script src="config.js"></script>
  <!-- Scripts -->
  <script src="app.js"></script>
  <!-- Custom Futuristic Cursor Element -->
  <div id="cursor-dot"></div>
</body>
</html>
