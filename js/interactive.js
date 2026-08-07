/* ============================================================
   BUILDATHON — INTERACTIVE & FUTURISTIC SCRIPTS
   ============================================================ */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywx-ISL3pZTnv54Zjw3daLaojaIsUG9lK1YLcVan_rDn7WZiLx1cAfHaxI6NM_ZUqNEA/exec';

/* ── Web Audio Synth (No external files needed!) ────────── */
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('buildathon_muted') === 'true';
    this.initAudio();
  }

  initAudio() {
    // Lazy initialize AudioContext on user interaction
    const init = () => {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.updateToggler();
      }
    };
    ['click', 'touchstart', 'mousemove'].forEach(e => document.addEventListener(e, init, { once: true }));
  }

  playBlip() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playTick() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playSuccess() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Play two notes in quick succession (c5 to e5)
    this.playTone(523.25, 0.08, now);
    this.playTone(659.25, 0.15, now + 0.08);
  }

  playTone(freq, dur, startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.03, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + dur);
  }

  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('buildathon_muted', this.muted);
    this.updateToggler();
  }

  updateToggler() {
    const btn = document.querySelector('.audio-toggle');
    if (!btn) return;
    if (this.muted) {
      btn.innerHTML = '🔇';
      btn.classList.add('muted');
    } else {
      btn.innerHTML = '🔊';
      btn.classList.remove('muted');
    }
  }
}

const sfx = new SoundEffects();

// Register Audio events
document.addEventListener('DOMContentLoaded', () => {
  // Bind sound triggers to elements
  document.querySelectorAll('a, button, .preview-card, .challenge-card, .faq-question').forEach(el => {
    el.addEventListener('mouseenter', () => sfx.playTick());
    el.addEventListener('click', () => sfx.playBlip());
  });
});


/* ── Terminal Simulator ──────────────────────────────────── */
class TerminalSimulator {
  constructor(elementId) {
    this.el = document.getElementById(elementId);
    if (!this.el) return;
    this.logs = [
      { text: "INITIALIZING BUILDATHON MAIN INFRASTRUCTURE...", type: "info" },
      { text: "FETCHING DEPENDENCIES (TensorFlow 2.15, PyTorch 2.2, OpenAI-SDK)... SUCCESS", type: "success" },
      { text: "ESTABLISHING SECURE WEBSOCKET TO HACKATHON SHEETS DATABASE... CONFIGURED", type: "success" },
      { text: "STARTING AI MATRIX GENERATOR CANVAS DEPLOYMENT...", type: "info" },
      { text: "SPAWNING 9 CHALLENGE CONTAINER TRACKS (TRACK_01 to TRACK_09)... ONLINE", type: "success" },
      { text: "ENABLING WEB AUDIO OSCILLATION FEEDBACK CONTROLLERS... MOUNTED", type: "success" },
      { text: "RUNNING INTEGRITY HEALTH CHECKS... WARNING: 13 DAYS REMAINING UNTIL KICKOFF", type: "warning" },
      { text: "INITIALIZING CHATBOT COGNITIVE COPROCESSOR COMPILING QUESTIONS...", type: "info" },
      { text: "LOADING HACKATHON REGISTRATION MODULES ON PROTOCOL SHEET...", type: "info" },
      { text: "BUILDATHON SYSTEM DEPLOYED ONLINE FOR HACKERS.", type: "success" },
      { text: "SYSADMIN LOG: run 'npm run dev' to launch local testing...", type: "info" },
      { text: "HACKING COMMENCING ON 13TH AUGUST 2026, 9:00 AM IST.", type: "success" }
    ];
    this.currentLine = 0;
    this.start();
  }

  start() {
    this.el.innerHTML = '';
    this.writeNext();
  }

  writeNext() {
    if (this.currentLine >= this.logs.length) {
      // Loop or stop
      setTimeout(() => this.start(), 8000);
      return;
    }
    const log = this.logs[this.currentLine];
    const row = document.createElement('div');
    row.className = 'terminal-line';
    
    let typeClass = '';
    if (log.type === 'success') typeClass = 'terminal-success';
    else if (log.type === 'warning') typeClass = 'terminal-warning';
    
    row.innerHTML = `<span class="terminal-prompt">&gt;</span> <span class="${typeClass}"></span>`;
    this.el.appendChild(row);
    this.el.scrollTop = this.el.scrollHeight;
    
    // Typewriter effect on line
    let charIdx = 0;
    const txtSpan = row.querySelector('span:last-child');
    const typeChar = () => {
      if (charIdx < log.text.length) {
        txtSpan.textContent += log.text[charIdx];
        charIdx++;
        setTimeout(typeChar, 10 + Math.random() * 20);
      } else {
        this.currentLine++;
        setTimeout(() => this.writeNext(), 800 + Math.random() * 600);
      }
    };
    typeChar();
  }
}


/* ── AI FAQ Floating Chatbot ──────────────────────────────── */
class FAQChatbot {
  constructor() {
    this.trigger = document.querySelector('.chatbot-trigger');
    this.window = document.querySelector('.chatbot-window');
    this.closeBtn = document.querySelector('.chatbot-close');
    this.msgContainer = document.querySelector('.chatbot-messages');
    this.suggContainer = document.querySelector('.chatbot-suggestions');
    this.backContainer = document.querySelector('.chatbot-back-container');
    this.backBtn = document.querySelector('.chat-back-btn');
    this.inputField = document.getElementById('chat-user-query');
    this.sendBtn = document.getElementById('chat-send-btn');
    
    this.responses = {
      eligibility: "Any college student is welcome! Undergraduates, postgraduates, engineering, science, or commerce streams. All years welcome.",
      registration: "Registration is simple! Only the team leader needs to fill the form with the team size and chosen track. The leader then dynamically adds details for other members.",
      tracks: "We have 9 tracks! Connected Communities (Social), AI for Impact (Real AI), Future Learning (EdTech), Green Future (Eco), Smart Agriculture, Smart Sports, Healthcare, Women Safety, and Smart Campus.",
      submission: "At the end of Round 2, you must submit a working prototype, link to the source code repository, project presentation (PPT), and a system architecture diagram.",
      prizes: "Rewards are exciting surprises! Winners will receive trophies, exclusive developer gear, certificates, and mystery reward hampers. All participants receive badges, certificates, and swag kits!",
      help: "I am the Buildathon AI assistant. Ask me about eligibility, registration steps, 9 tracks, deliverables, or rewards!"
    };

    // Client-side local knowledge base for free, zero-latency custom Q&A search
    this.knowledgeBase = [
      {
        keywords: ['eligible', 'eligibility', 'who', 'participate', 'join', 'student', 'year', 'college', 'branch', 'qualification', 'qualification', 'qualification', 'qualification'],
        answer: "Any college student is welcome to participate! Undergraduates, postgraduates, engineering, science, or commerce streams. All years and colleges are welcome."
      },
      {
        keywords: ['register', 'registration', 'how', 'form', 'link', 'signup', 'apply', 'leader', 'fee', 'registering'],
        answer: "Registration is simple and free! Only the team leader needs to fill the registration form first. Once the leader registers and receives a Team ID, they can dynamically add the other 1 to 3 members using their dashboard. Capped at 2–4 members per team."
      },
      {
        keywords: ['track', 'tracks', 'challenge', 'challenges', 'topic', 'topics', 'theme', 'themes', 'category', 'categories'],
        answer: "We have 9 tracks:<br>• <strong>Track 01</strong>: Connected Communities (Social Welfare)<br>• <strong>Track 02</strong>: AI for Impact (Real-World AI)<br>• <strong>Track 03</strong>: Future Learning (EdTech)<br>• <strong>Track 04</strong>: Green Future (Sustainability)<br>• <strong>Track 05</strong>: Smart Agriculture (AgriTech)<br>• <strong>Track 06</strong>: Smart Sports (SportsTech)<br>• <strong>Track 07</strong>: Smart Healthcare (Digital Health)<br>• <strong>Track 08</strong>: Women Safety (SafeHer)<br>• <strong>Track 09</strong>: Smart Campus (Digital College)<br><a href='challenges.html' style='color:var(--neon-cyan); text-decoration:underline;'>View all track details here</a>."
      },
      {
        keywords: ['submit', 'submission', 'deliverable', 'deliverables', 'what to submit', 'round 2', 'prototype', 'source code', 'ppt', 'github'],
        answer: "For Round 2, teams must submit:<br>1. A working prototype (Web/Mobile/Desktop).<br>2. Link to the source code repository (GitHub).<br>3. Project Presentation (PPT).<br>4. System Architecture Diagram."
      },
      {
        keywords: ['reward', 'rewards', 'prize', 'prizes', 'cash', 'money', 'certificate', 'certificates', 'swag', 'trophy', 'trophies', 'surprise', 'amount', 'win'],
        answer: "Rewards are exciting surprises! Winners will receive trophies, exclusive developer gear, certificates, and mystery reward hampers. All participants receive badges, certificates, and swag kits! (No cash prize amounts are announced, they are mystery surprise rewards)."
      },
      {
        keywords: ['time', 'duration', 'hour', 'hours', 'when', 'date', 'timeline', 'schedule', 'rounds', 'round', 'elimination', 'day', 'august'],
        answer: "Buildathon 2026 is a <strong>4-hour hackathon</strong> on August 13, 2026. Timeline:<br>• <strong>9:00 AM IST</strong>: Round 1 (Problem Solving - top 5-6 qualify)<br>• <strong>10:30 AM IST</strong>: Round 2 (AI Web Building - top 3 qualify)<br>• <strong>12:00 PM IST</strong>: Round 3 (Product Pitch & Demo - final presentations)<br>• <strong>1:00 PM IST</strong>: Results & Award Distribution."
      },
      {
        keywords: ['team', 'member', 'members', 'size', 'limit', 'many', 'partner', 'solo', 'individual', 'people'],
        answer: "Teams must consist of <strong>2 to 4 members</strong>. Individual (solo) participation is not allowed. All team members must be registered under the same Team ID."
      },
      {
        keywords: ['rule', 'rules', 'guideline', 'guidelines', 'allow', 'allowed', 'use', 'ai', 'assisted', 'chatgpt', 'copilot', 'cheating'],
        answer: "Rules:<br>1. Build within the hackathon duration.<br>2. AI-assisted coding (like ChatGPT/Copilot) is fully permitted, but participants must explain their work to the judges.<br>3. Open-source libraries and public APIs are allowed.<br>4. Ideas must be original, secure, and scalable."
      }
    ];

    this.init();
  }

  init() {
    if (!this.trigger || !this.window) return;

    this.trigger.addEventListener('click', () => {
      this.window.classList.add('active');
      this.trigger.style.display = 'none';
      if (this.msgContainer.children.length === 0) {
        this.addBotMessage("Hi hacker! Welcome to Buildathon 2026. How can I help you build the future today?");
      }
    });

    this.closeBtn.addEventListener('click', () => {
      this.window.classList.remove('active');
      this.trigger.style.display = 'flex';
    });

    this.suggContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('chat-sugg-btn')) {
        const query = e.target.dataset.query;
        const text = e.target.textContent;
        this.handleUserQuery(query, text);
      }
    });

    // Back Button Logic
    if (this.backBtn && this.backContainer) {
      this.backBtn.addEventListener('click', () => {
        this.backContainer.style.display = 'none';
        this.suggContainer.style.display = 'flex';
      });
    }

    // Input Submission Logic
    if (this.sendBtn && this.inputField) {
      const submitCustomQuery = () => {
        const queryVal = this.inputField.value.trim();
        if (!queryVal) return;
        this.inputField.value = '';
        this.handleCustomQuery(queryVal);
      };
      
      this.sendBtn.addEventListener('click', submitCustomQuery);
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          submitCustomQuery();
        }
      });
    }
  }

  addBotMessage(text) {
    const el = document.createElement('div');
    el.className = 'chat-msg bot';
    el.innerHTML = `<span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--neon-purple);display:block;margin-bottom:0.25rem;">SYSTEM_COGNITIVE_BOT</span>${text}`;
    this.msgContainer.appendChild(el);
    this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
    sfx.playTick();
  }

  addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'chat-msg user';
    el.textContent = text;
    this.msgContainer.appendChild(el);
    this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
  }

  handleUserQuery(query, displayTxt) {
    this.addUserMessage(displayTxt);
    
    // Hide suggestions, show back button
    if (this.suggContainer && this.backContainer) {
      this.suggContainer.style.display = 'none';
      this.backContainer.style.display = 'block';
    }
    
    // Simulate thinking delay
    setTimeout(() => {
      const resp = this.responses[query] || this.responses.help;
      this.addBotMessage(resp);
    }, 600);
  }

  handleCustomQuery(queryText) {
    this.addUserMessage(queryText);
    
    // Hide suggestions, show back button
    if (this.suggContainer && this.backContainer) {
      this.suggContainer.style.display = 'none';
      this.backContainer.style.display = 'block';
    }
    
    // Append a temporary loading bot message to feel dynamic
    const tempBotMsg = document.createElement('div');
    tempBotMsg.className = 'chat-msg bot';
    tempBotMsg.innerHTML = `<span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--neon-purple);display:block;margin-bottom:0.25rem;">SYSTEM_COGNITIVE_BOT</span><span class="chat-bot-loading"><span class="spinner" style="display:inline-block;width:12px;height:12px;border:2px solid var(--neon-purple);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin-right:0.5rem;vertical-align:middle;"></span>Searching local site rules...</span>`;
    this.msgContainer.appendChild(tempBotMsg);
    this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
    sfx.playTick();
    
    // Perform keyword analysis locally
    setTimeout(() => {
      const lowerQuery = queryText.toLowerCase();
      let bestMatch = null;
      let highestScore = 0;
      
      this.knowledgeBase.forEach(item => {
        let score = 0;
        item.keywords.forEach(kw => {
          if (lowerQuery.indexOf(kw) !== -1) {
            score++;
          }
        });
        if (score > highestScore) {
          highestScore = score;
          bestMatch = item;
        }
      });
      
      let reply = "";
      if (highestScore > 0 && bestMatch) {
        reply = bestMatch.answer;
      } else {
        reply = "I couldn't find an exact answer. Here is how I can help:<br>• Ask about <strong>eligibility</strong> or who can participate.<br>• Ask about the <strong>9 tracks</strong> of the event.<br>• Ask about the <strong>4-hour timeline</strong> and schedule.<br>• Ask how to <strong>register</strong> or add team members.<br>• Ask about <strong>rules</strong> or <strong>deliverables</strong>.";
      }
      
      const loader = tempBotMsg.querySelector('.chat-bot-loading');
      if (loader) {
        tempBotMsg.innerHTML = `<span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--neon-purple);display:block;margin-bottom:0.25rem;">SYSTEM_COGNITIVE_BOT</span>${reply}`;
        sfx.playSuccess();
      }
    }, 450);
  }
}


/* ── Team Check-In Status Lookup ──────────────────────────── */
class CheckInStatus {
  constructor() {
    this.form = document.getElementById('checkin-form');
    this.results = document.querySelector('.checkin-results');
    this.error = document.getElementById('checkin-error');
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const teamId = this.form.teamIdQuery.value.trim().toUpperCase();
      if (!teamId) return;

      const btn = this.form.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Querying Sheet...';
      this.results.style.display = 'none';
      if (this.error) this.error.style.display = 'none';

      const data = {
        action: 'queryTeam',
        teamId: teamId
      };

      try {
        const resp = await fetch(SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(data)
        });
        
        const result = await resp.json();
        
        btn.disabled = false;
        btn.innerHTML = origText;
        
        if (result.status === 'success') {
          sfx.playSuccess();
          this.results.style.display = 'block';
          document.getElementById('ci-team-id').textContent = result.teamId;
          document.getElementById('ci-team-name').textContent = result.teamName;
          document.getElementById('ci-leader').textContent = result.leaderName;
          document.getElementById('ci-track').textContent = result.track;
          document.getElementById('ci-status').textContent = `✅ VERIFIED (${result.memberCount} Members)`;
          document.getElementById('ci-status').className = 'text-neon-green';
        } else {
          if (this.error) {
            this.error.textContent = result.message || 'Team ID not found. Ensure leader completed registration.';
            this.error.style.display = 'block';
          }
        }
      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = origText;
        if (this.error) {
          this.error.textContent = 'Connection error. Please try again.';
          this.error.style.display = 'block';
        }
      }
    });
  }
}


/* ── Coding Hacking Sandbox Game ─────────────────────────── */
/* ── Prompt-Driven Website Builder ─────────────────────────── */
class CodingGame {
  constructor() {
    this.promptInput = document.getElementById('vibe-prompt-input');
    this.buildBtn = document.getElementById('vibe-build-btn');
    this.suggChips = document.querySelectorAll('.vibe-sugg-chip');
    this.previewBtn = document.getElementById('vibe-preview-btn');
    this.coreStatus = document.getElementById('game-core-status');
    this.themeVal = document.getElementById('game-theme-val');
    this.layoutVal = document.getElementById('game-layout-val');
    this.previewCard = document.getElementById('vibe-preview-card');
    this.iconEl = document.getElementById('vibe-icon');
    this.titleEl = document.getElementById('vibe-title');
    this.descEl = document.getElementById('vibe-desc');
    this.badgeEl = document.getElementById('vibe-badge');
    this.consoleLog = document.getElementById('game-console-log');
    
    // Preview Overlay & Inline phone viewport
    this.phoneRenderView = document.getElementById('vibe-phone-render-view');
    this.overlay = document.getElementById('full-preview-overlay');
    this.overlayClose = document.getElementById('close-preview-btn');
    this.overlayCloseDot = document.getElementById('close-preview-dot');
    this.overlayRenderBody = document.getElementById('preview-render-body');
    
    this.tabLiveBtn = document.getElementById('tab-live-btn');
    this.tabCodeBtn = document.getElementById('tab-code-btn');
    this.renderPanel = document.getElementById('preview-render-panel');
    this.codePanel = document.getElementById('preview-code-panel');
    this.codeOutput = document.getElementById('code-output-display');
    this.copyBtn = document.getElementById('btn-copy-code');
    this.downloadBtn = document.getElementById('btn-download-site');

    if (!this.promptInput) return; // Exit if not on landing page

    this.compiledData = null;
    this.init();
  }

  init() {
    // Setup Suggestion Clickers
    this.suggChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.promptInput.value = chip.dataset.prompt;
        this.triggerBuild();
      });
    });

    // Setup Main Build Button Clicker
    this.buildBtn.addEventListener('click', () => this.triggerBuild());

    // Enter Key builds
    this.promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.triggerBuild();
    });

    // Preview clicker
    this.previewBtn.addEventListener('click', () => this.showPreviewOverlay());

    // Close preview action
    if (this.overlayClose) {
      this.overlayClose.addEventListener('click', () => this.hidePreviewOverlay());
    }
    if (this.overlayCloseDot) {
      this.overlayCloseDot.addEventListener('click', () => this.hidePreviewOverlay());
    }

    // Tabs logic
    if (this.tabLiveBtn && this.tabCodeBtn) {
      this.tabLiveBtn.addEventListener('click', () => this.toggleTab('live'));
      this.tabCodeBtn.addEventListener('click', () => this.toggleTab('code'));
    }

    // Copy & Download Actions
    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copyCodeToClipboard());
    }
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => this.downloadStandaloneHTML());
    }
  }

  toggleTab(tab) {
    if (tab === 'live') {
      this.tabLiveBtn.classList.add('active');
      this.tabCodeBtn.classList.remove('active');
      this.renderPanel.classList.add('active');
      this.codePanel.classList.remove('active');
      this.renderPanel.style.display = 'block';
      this.codePanel.style.display = 'none';
    } else {
      this.tabLiveBtn.classList.remove('active');
      this.tabCodeBtn.classList.add('active');
      this.renderPanel.classList.remove('active');
      this.codePanel.classList.add('active');
      this.renderPanel.style.display = 'none';
      this.codePanel.style.display = 'block';

      // Load code output
      if (this.compiledData && this.codeOutput) {
        const fullHTML = this.generateWebsiteHTML(this.compiledData.theme, this.compiledData.layout, true);
        this.codeOutput.textContent = fullHTML;
      }
    }
  }

  copyCodeToClipboard() {
    if (!this.compiledData || !this.codeOutput) return;
    navigator.clipboard.writeText(this.codeOutput.textContent).then(() => {
      const originalText = this.copyBtn.textContent;
      this.copyBtn.textContent = '📋 Copied!';
      sfx.playSuccess();
      setTimeout(() => {
        this.copyBtn.textContent = originalText;
      }, 2000);
    });
  }

  downloadStandaloneHTML() {
    if (!this.compiledData) return;
    const fullHTML = this.generateWebsiteHTML(this.compiledData.theme, this.compiledData.layout, true);
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibe-compiled-${this.compiledData.layout}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sfx.playSuccess();
  }

  async triggerBuild() {
    const prompt = this.promptInput.value.trim();
    if (!prompt) return;

    // Lock controls
    this.promptInput.disabled = true;
    this.buildBtn.disabled = true;
    this.previewBtn.disabled = true;
    this.previewBtn.style.opacity = '0.5';
    this.previewBtn.style.filter = 'grayscale(1)';
    this.previewBtn.style.cursor = 'not-allowed';

    if (this.phoneRenderView) {
      this.phoneRenderView.style.display = 'none';
    }

    if (this.coreStatus) {
      this.coreStatus.textContent = 'COMPILING_VIBES...';
      this.coreStatus.className = 'game-stat-value text-neon-orange';
    }

    if (this.consoleLog) {
      this.consoleLog.innerHTML = `<div class="console-line info">&gt; Prompt entered: "${prompt}"</div>`;
    }

    // 1. Analyze prompt to extract parameters
    const promptLower = prompt.toLowerCase();
    
    // Theme matching
    let theme = 'gradient';
    let themeName = 'Vibe Gradient';
    if (promptLower.includes('cyberpunk') || promptLower.includes('dark') || promptLower.includes('neon') || promptLower.includes('black') || promptLower.includes('cyber')) {
      theme = 'cyberpunk';
      themeName = 'Cyberpunk Neon';
    } else if (promptLower.includes('minimalist') || promptLower.includes('clean') || promptLower.includes('white') || promptLower.includes('light') || promptLower.includes('simple')) {
      theme = 'minimalist';
      themeName = 'Minimalist Light';
    } else if (promptLower.includes('green') || promptLower.includes('nature') || promptLower.includes('eco') || promptLower.includes('organic') || promptLower.includes('plant') || promptLower.includes('forest')) {
      theme = 'eco';
      themeName = 'Eco Green';
    } else if (promptLower.includes('gold') || promptLower.includes('luxury') || promptLower.includes('premium') || promptLower.includes('elegant')) {
      theme = 'gold';
      themeName = 'Gold Luxury';
    } else if (promptLower.includes('synthwave') || promptLower.includes('sunset') || promptLower.includes('purple') || promptLower.includes('pink') || promptLower.includes('retro')) {
      theme = 'synthwave';
      themeName = 'Retro Synthwave';
    } else if (promptLower.includes('ocean') || promptLower.includes('pastel') || promptLower.includes('blue') || promptLower.includes('water') || promptLower.includes('sky')) {
      theme = 'pastel';
      themeName = 'Ocean Pastel';
    }

    // Layout matching
    let layout = 'landing';
    let layoutName = 'SaaS Landing';
    if (promptLower.includes('portfolio') || promptLower.includes('personal') || promptLower.includes('dev') || promptLower.includes('designer') || promptLower.includes('resume') || promptLower.includes('cv')) {
      layout = 'portfolio';
      layoutName = 'Dev Portfolio';
    } else if (promptLower.includes('shop') || promptLower.includes('store') || promptLower.includes('e-commerce') || promptLower.includes('organic') || promptLower.includes('sell') || promptLower.includes('product')) {
      layout = 'shop';
      layoutName = 'Store Marketplace';
    } else if (promptLower.includes('dashboard') || promptLower.includes('saas') || promptLower.includes('analytics') || promptLower.includes('metrics') || promptLower.includes('board') || promptLower.includes('app')) {
      layout = 'dashboard';
      layoutName = 'Admin Dashboard';
    } else if (promptLower.includes('soon') || promptLower.includes('coming') || promptLower.includes('event') || promptLower.includes('countdown')) {
      layout = 'comingsoon';
      layoutName = 'Coming Soon';
    } else if (promptLower.includes('price') || promptLower.includes('pricing') || promptLower.includes('plan') || promptLower.includes('subscription')) {
      layout = 'pricing';
      layoutName = 'Pricing Plans';
    }

    // Setup preview badge data
    const presets = {
      portfolio: { icon: '👨‍💻', title: 'Creative Portfolio', desc: 'Sleek personal dev landing compiled.' },
      shop: { icon: '🛍️', title: 'Future Store', desc: 'Responsive product marketplace compiled.' },
      dashboard: { icon: '📊', title: 'Admin Dashboard', desc: 'Stats monitoring chart node compiled.' },
      landing: { icon: '🚀', title: 'Startup Landing', desc: 'SaaS homepage product panel compiled.' },
      comingsoon: { icon: '⏱️', title: 'Coming Soon', desc: 'Launch event countdown frame compiled.' },
      pricing: { icon: '💰', title: 'Pricing Board', desc: 'Subscription tier cards compiled.' }
    };
    const preset = presets[layout];

    // Save compiled state
    this.compiledData = { theme, layout, themeName, layoutName, prompt };

    // 2. Sequential compiler logging
    const logSteps = [
      `> Match result: detected vibe aesthetic = [${themeName.toUpperCase()}]`,
      `> Match result: detected viewport layout = [${layoutName.toUpperCase()}]`,
      `> Ingesting HTML structural markup templates...`,
      `> Binding CSS custom variables and theme gradients...`,
      `> Optimizing layout assets and responsive column scaling...`,
      `> Packaging bundle: minifying stylesheet attributes...`,
      `> compilation: 100% SUCCESS. Ready for preview.`
    ];

    sfx.playSuccess();

    for (const step of logSteps) {
      await new Promise(r => setTimeout(r, 450));
      this.appendConsoleLine(step, 'success');
    }

    // Apply variables to phone mockup
    if (this.previewCard) {
      this.previewCard.className = `vibe-phone-mockup vibe-${theme}`;
    }
    if (this.iconEl) this.iconEl.textContent = preset.icon;
    if (this.titleEl) this.titleEl.textContent = preset.title;
    if (this.descEl) this.descEl.textContent = preset.desc;
    if (this.badgeEl) this.badgeEl.textContent = `Vibe: ${themeName}`;

    if (this.themeVal) this.themeVal.textContent = themeName.toUpperCase();
    if (this.layoutVal) this.layoutVal.textContent = layoutName.toUpperCase();

    // Render directly in phone render view
    if (this.phoneRenderView) {
      const phoneHTML = this.generateWebsiteHTML(theme, layout, false);
      this.phoneRenderView.innerHTML = phoneHTML;
      this.phoneRenderView.style.display = 'block';
      this.bindMockupInteractions(layout, this.phoneRenderView);
    }

    if (this.coreStatus) {
      this.coreStatus.textContent = 'ONLINE';
      this.coreStatus.className = 'game-stat-value text-neon-green';
    }

    // Unlock Preview Button
    this.previewBtn.disabled = false;
    this.previewBtn.style.opacity = '1';
    this.previewBtn.style.filter = 'none';
    this.previewBtn.style.cursor = 'pointer';

    // Unlock controls
    this.promptInput.disabled = false;
    this.buildBtn.disabled = false;

    // Trigger confetti
    this.launchGameConfetti();
  }

  appendConsoleLine(text, type = '') {
    if (!this.consoleLog) return;
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = text;
    this.consoleLog.appendChild(line);
    this.consoleLog.scrollTop = this.consoleLog.scrollHeight;
  }

  showPreviewOverlay() {
    if (!this.compiledData || !this.overlay || !this.overlayRenderBody) return;

    sfx.playSuccess();
    const { theme, layout } = this.compiledData;

    // Default to live preview tab
    this.toggleTab('live');

    // Generate responsive preview page
    const compiledHTML = this.generateWebsiteHTML(theme, layout, false);
    this.overlayRenderBody.innerHTML = compiledHTML;

    // Show overlay
    this.overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scrolling

    // Bind interaction logic within the generated mockup
    this.bindMockupInteractions(layout, this.overlayRenderBody);
  }

  hidePreviewOverlay() {
    if (!this.overlay) return;
    this.overlay.style.display = 'none';
    document.body.style.overflow = ''; // Unlock background scrolling
  }

  generateWebsiteHTML(theme, layout, fullDocument = false) {
    // Style configurations for themes
    const themeStyles = {
      cyberpunk: `
        --preview-bg: #03030b;
        --preview-card: rgba(15, 15, 30, 0.95);
        --preview-text: #e8eaf6;
        --preview-accent: #00f5ff;
        --preview-secondary: #ff2d78;
        --preview-border: rgba(0, 245, 255, 0.25);
        --preview-shadow: 0 0 25px rgba(0, 245, 255, 0.25);
        --preview-font: 'Courier New', monospace;
      `,
      minimalist: `
        --preview-bg: #f5f6f9;
        --preview-card: #ffffff;
        --preview-text: #1a1a2e;
        --preview-accent: #111111;
        --preview-secondary: #5e648c;
        --preview-border: rgba(0, 0, 0, 0.08);
        --preview-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
        --preview-font: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      `,
      eco: `
        --preview-bg: #030f06;
        --preview-card: rgba(10, 28, 14, 0.95);
        --preview-text: #e8fbe8;
        --preview-accent: #39ff14;
        --preview-secondary: #00e676;
        --preview-border: rgba(57, 255, 20, 0.25);
        --preview-shadow: 0 0 25px rgba(57, 255, 20, 0.25);
        --preview-font: system-ui, sans-serif;
      `,
      gold: `
        --preview-bg: #0a0a0f;
        --preview-card: rgba(18, 18, 28, 0.95);
        --preview-text: #ffffff;
        --preview-accent: #d4af37;
        --preview-secondary: #c5a059;
        --preview-border: rgba(212, 175, 55, 0.25);
        --preview-shadow: 0 0 30px rgba(212, 175, 55, 0.2);
        --preview-font: Georgia, serif;
      `,
      synthwave: `
        --preview-bg: #1a0826;
        --preview-card: rgba(45, 12, 60, 0.95);
        --preview-text: #ffdcfd;
        --preview-accent: #ff2d78;
        --preview-secondary: #00f5ff;
        --preview-border: rgba(255, 45, 120, 0.25);
        --preview-shadow: 0 0 25px rgba(255, 45, 120, 0.25);
        --preview-font: 'Courier New', monospace;
      `,
      pastel: `
        --preview-bg: #f0f4f8;
        --preview-card: #ffffff;
        --preview-text: #2c3e50;
        --preview-accent: #3498db;
        --preview-secondary: #2ecc71;
        --preview-border: rgba(52, 152, 219, 0.15);
        --preview-shadow: 0 10px 30px rgba(52, 152, 219, 0.08);
        --preview-font: system-ui, sans-serif;
      `,
      gradient: `
        --preview-bg: #05030d;
        --preview-card: rgba(15, 10, 30, 0.95);
        --preview-text: #e8eaf6;
        --preview-accent: #7b2ff7;
        --preview-secondary: #00f5ff;
        --preview-border: rgba(123, 47, 247, 0.25);
        --preview-shadow: 0 0 25px rgba(123, 47, 247, 0.25);
        --preview-font: system-ui, sans-serif;
      `
    };

    const cssVariables = themeStyles[theme];

    // Layout templates
    let contentHTML = '';

    if (layout === 'portfolio') {
      contentHTML = `
        <div class="mock-header">
          <div class="logo">👨‍💻 VIBE_PORTFOLIO</div>
          <div class="nav-links">
            <span class="active">Home</span>
            <span>Projects</span>
            <span>About</span>
          </div>
        </div>
        <div class="mock-hero">
          <span class="badge">Aura Designer Portfolio</span>
          <h1>Designing the Future of Digital Aesthetics</h1>
          <p>We combine generative AI prompt pipelines, immaculate visual layouts, and responsive interaction design.</p>
          <div class="btn-group">
            <button class="mock-btn primary" id="btn-mock-action">Hire Studio</button>
            <button class="mock-btn secondary">Explore Work</button>
          </div>
        </div>
        <div class="mock-grid">
          <div class="mock-card">
            <div class="mock-card-icon">🧠</div>
            <h3>Project Cyberia</h3>
            <p>Artificial Intelligence engine dashboard UI with customized dark glassmorphism styling.</p>
          </div>
          <div class="mock-card">
            <div class="mock-card-icon">🌿</div>
            <h3>EcoSystem Portal</h3>
            <p>A green nature organic sustainable store marketplace platform built for climate solutions.</p>
          </div>
          <div class="mock-card">
            <div class="mock-card-icon">✨</div>
            <h3>Aura Shaders</h3>
            <p>High-contrast CSS animations and Web Audio API synthesized interface nodes.</p>
          </div>
        </div>
      `;
    } else if (layout === 'shop') {
      contentHTML = `
        <div class="mock-header">
          <div class="logo">🛍️ VIBE_RETAIL</div>
          <div class="cart-box">🛒 Cart: <span id="cart-counter" style="color:var(--preview-accent); font-weight:700;">0</span> items</div>
        </div>
        <div class="mock-hero">
          <span class="badge">Limited Vibe Editions</span>
          <h1>Aesthetic Smart Gear Marketplace</h1>
          <p>Get exclusive AI-calibrated hoodies, shades, and accessories compiled on spot.</p>
        </div>
        <div class="mock-grid">
          <div class="mock-card product">
            <div class="product-img">🕶️</div>
            <h3>Quantum Cyber Shades</h3>
            <span class="price">$149.00</span>
            <button class="mock-btn primary add-cart-btn">Add To Cart</button>
          </div>
          <div class="mock-card product">
            <div class="product-img">🧥</div>
            <h3>Vibe Core Hoodie</h3>
            <span class="price">$89.00</span>
            <button class="mock-btn primary add-cart-btn">Add To Cart</button>
          </div>
          <div class="mock-card product">
            <div class="product-img">☕</div>
            <h3>Developer Thermos</h3>
            <span class="price">$24.00</span>
            <button class="mock-btn primary add-cart-btn">Add To Cart</button>
          </div>
        </div>
      `;
    } else if (layout === 'dashboard') {
      contentHTML = `
        <div class="mock-header">
          <div class="logo">📊 APEX_ANALYTICS</div>
          <div class="nav-links">
            <span class="active">Overview</span>
            <span>Logs</span>
            <span>Clusters</span>
          </div>
        </div>
        <div class="mock-hero" style="padding-bottom:1rem;">
          <h1>System Control Hub</h1>
          <p>Real-time cluster data integrity calibrations.</p>
        </div>
        <div class="stats-boxes">
          <div class="stat-box">
            <span class="stat-lbl">Active Integrity</span>
            <span class="stat-num">98.4%</span>
          </div>
          <div class="stat-box">
            <span class="stat-lbl">Vibe Calibrations</span>
            <span class="stat-num">Immaculate</span>
          </div>
          <div class="stat-box">
            <span class="stat-lbl">Response Delay</span>
            <span class="stat-num">24.1ms</span>
          </div>
        </div>
        <div class="mock-card" style="margin-top: 1.5rem; max-width: 900px; margin-left: auto; margin-right: auto;">
          <h3>Aesthetic Calibrations Status Chart</h3>
          <div class="chart-mockup">
            <div class="chart-bar" style="height: 40%; --bar-delay:0.1s;"></div>
            <div class="chart-bar" style="height: 75%; --bar-delay:0.2s;"></div>
            <div class="chart-bar" style="height: 60%; --bar-delay:0.3s;"></div>
            <div class="chart-bar" style="height: 90%; --bar-delay:0.4s;"></div>
          </div>
          <div style="text-align: right; margin-top: 1rem;">
            <button class="mock-btn primary" id="btn-mock-opt">Optimize Clusters</button>
          </div>
        </div>
      `;
    } else if (layout === 'comingsoon') {
      contentHTML = `
        <div class="mock-header">
          <div class="logo">⏳ EVENT_TIME</div>
          <div class="cart-box">Launching Soon</div>
        </div>
        <div class="mock-hero" style="margin-top: 4rem;">
          <span class="badge">Countdown Activated</span>
          <h1 style="font-size:clamp(2.5rem, 5vw, 4rem);">We are Launching Soon</h1>
          <p>Immaculate digital structures and interface shaders compiling in the background.</p>
          <div style="display:flex; justify-content:center; gap:1.5rem; margin:2rem auto; max-width:400px;">
            <div style="background:var(--preview-card); border:1px solid var(--preview-border); border-radius:8px; padding:1rem; flex:1;">
              <h2 style="color:var(--preview-accent); margin:0;">12</h2>
              <span style="font-size:0.6rem; opacity:0.6; text-transform:uppercase;">Days</span>
            </div>
            <div style="background:var(--preview-card); border:1px solid var(--preview-border); border-radius:8px; padding:1rem; flex:1;">
              <h2 style="color:var(--preview-accent); margin:0;">08</h2>
              <span style="font-size:0.6rem; opacity:0.6; text-transform:uppercase;">Hours</span>
            </div>
            <div style="background:var(--preview-card); border:1px solid var(--preview-border); border-radius:8px; padding:1rem; flex:1;">
              <h2 style="color:var(--preview-accent); margin:0;">42</h2>
              <span style="font-size:0.6rem; opacity:0.6; text-transform:uppercase;">Mins</span>
            </div>
          </div>
          <div style="max-width:450px; margin:2rem auto; display:flex; gap:0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--preview-border); border-radius:50px; padding:4px;">
            <input type="email" id="mock-notify-email" placeholder="Enter email address" style="flex:1; border:none; outline:none; background:transparent; color:#fff; padding:0 1rem; font-size:0.85rem;">
            <button class="mock-btn primary" id="btn-mock-notify" style="padding:0.6rem 1.4rem;">Notify Me</button>
          </div>
        </div>
      `;
    } else if (layout === 'pricing') {
      contentHTML = `
        <div class="mock-header">
          <div class="logo">💳 PLAN_TIERS</div>
          <div class="nav-links"><span>FAQ</span><span>Support</span></div>
        </div>
        <div class="mock-hero" style="margin-bottom:3rem;">
          <span class="badge">Transparent Plans</span>
          <h1>Choose Your Calibration Tier</h1>
          <p>Sleek design tokens configured for every scale of developer work.</p>
        </div>
        <div class="mock-grid">
          <div class="mock-card" style="display:flex; flex-direction:column; justify-content:space-between; min-height:350px;">
            <div>
              <h3>Basic Plan</h3>
              <div style="font-size:1.8rem; font-weight:800; color:var(--preview-secondary); margin:1rem 0;">$0 <span style="font-size:0.75rem; font-weight:400; color:var(--preview-text); opacity:0.6;">/mo</span></div>
              <ul style="padding-left:1.2rem; font-size:0.8rem; opacity:0.8; line-height:1.8;">
                <li>Local compiler access</li>
                <li>Standard layout themes</li>
                <li>Responsive previews</li>
              </ul>
            </div>
            <button class="mock-btn secondary mock-checkout-btn" data-plan="Basic" style="width:100%;">Select Basic</button>
          </div>
          <div class="mock-card" style="display:flex; flex-direction:column; justify-content:space-between; min-height:350px; border-color:var(--preview-accent); box-shadow:var(--preview-shadow); position:relative;">
            <span style="position:absolute; top:-12px; right:20px; background:var(--preview-accent); color:#000; font-family:monospace; font-size:0.55rem; font-weight:700; padding:2px 8px; border-radius:4px;">RECOMMENDED</span>
            <div>
              <h3>Vibe Pro</h3>
              <div style="font-size:1.8rem; font-weight:800; color:var(--preview-accent); margin:1rem 0;">$29 <span style="font-size:0.75rem; font-weight:400; color:var(--preview-text); opacity:0.6;">/mo</span></div>
              <ul style="padding-left:1.2rem; font-size:0.8rem; opacity:0.8; line-height:1.8;">
                <li>Unlimited compilations</li>
                <li>Synthwave & Pastel shaders</li>
                <li>Standalone ZIP export</li>
                <li>Priority queue builder</li>
              </ul>
            </div>
            <button class="mock-btn primary mock-checkout-btn" data-plan="Vibe Pro" style="width:100%;">Upgrade to Pro</button>
          </div>
          <div class="mock-card" style="display:flex; flex-direction:column; justify-content:space-between; min-height:350px;">
            <div>
              <h3>Enterprise</h3>
              <div style="font-size:1.8rem; font-weight:800; color:var(--preview-secondary); margin:1rem 0;">$99 <span style="font-size:0.75rem; font-weight:400; color:var(--preview-text); opacity:0.6;">/mo</span></div>
              <ul style="padding-left:1.2rem; font-size:0.8rem; opacity:0.8; line-height:1.8;">
                <li>Custom prompt heuristics</li>
                <li>Dedicated neural cluster</li>
                <li>24/7 Slack support</li>
                <li>Unlimited workspace seats</li>
              </ul>
            </div>
            <button class="mock-btn secondary mock-checkout-btn" data-plan="Enterprise" style="width:100%;">Contact Sales</button>
          </div>
        </div>
      `;
    } else {
      // Landing
      contentHTML = `
        <div class="mock-header">
          <div class="logo">🚀 AURA_SaaS</div>
          <div class="nav-links">
            <span>Features</span>
            <span>Docs</span>
            <button class="mock-btn primary">Login</button>
          </div>
        </div>
        <div class="mock-hero">
          <span class="badge">Next Generation Web Compiler</span>
          <h1>No-Code Landing Page Compiler</h1>
          <p>Type text prompts to automatically generate layouts, stylesheets, and mock content instantly.</p>
          <div class="btn-group">
            <button class="mock-btn primary" id="btn-mock-action">Get Started</button>
            <button class="mock-btn secondary">Explore Features</button>
          </div>
        </div>
        <div class="mock-grid">
          <div class="mock-card">
            <h3>⚡ Instant Builds</h3>
            <p>Heuristic compiler builds structural previews locally in 1.2 seconds.</p>
          </div>
          <div class="mock-card">
            <h3>💡 Custom Aesthetics</h3>
            <p>Sleek visual layouts mapping variables matching the mood of prompts.</p>
          </div>
          <div class="mock-card">
            <h3>📱 Responsive Grid</h3>
            <p>Renders viewport wrappers matching desktops, tablets, and smartphones.</p>
          </div>
        </div>
      `;
    }

    const cssRules = `
        #preview-frame-container {
          ${cssVariables}
          background: var(--preview-bg);
          color: var(--preview-text);
          font-family: var(--preview-font);
          min-height: 100vh;
          padding: 2.5rem 1.5rem;
          box-sizing: border-box;
          transition: all 0.3s;
        }
        #preview-frame-container * {
          box-sizing: border-box;
        }
        .mock-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1000px;
          margin: 0 auto 3rem;
          border-bottom: 1px solid var(--preview-border);
          padding-bottom: 1rem;
        }
        .mock-header .logo {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: var(--preview-accent);
        }
        .mock-header .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          font-size: 0.8rem;
        }
        .mock-header .nav-links span {
          cursor: pointer;
          opacity: 0.7;
          transition: 0.3s;
        }
        .mock-header .nav-links span:hover, .mock-header .nav-links span.active {
          opacity: 1;
          color: var(--preview-accent);
        }
        .mock-hero {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 4rem;
        }
        .mock-hero h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.2;
          margin: 0.8rem 0 1.2rem;
          font-weight: 800;
          color: #fff;
          text-shadow: 0 0 10px rgba(255,255,255,0.05);
        }
        .mock-hero p {
          font-size: 0.95rem;
          line-height: 1.6;
          opacity: 0.8;
          max-width: 550px;
          margin: 0 auto 2rem;
        }
        .badge {
          display: inline-block;
          font-size: 0.65rem;
          font-family: monospace;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--preview-border);
          border-radius: 50px;
          padding: 0.25rem 0.75rem;
          color: var(--preview-secondary);
          text-transform: uppercase;
        }
        .btn-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .mock-btn {
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.7rem 1.8rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .mock-btn.primary {
          background: var(--preview-accent);
          color: #000;
          border: 1px solid var(--preview-accent);
        }
        .mock-btn.primary:hover {
          background: transparent;
          color: var(--preview-accent);
          box-shadow: var(--preview-shadow);
        }
        .mock-btn.secondary {
          background: transparent;
          color: #fff;
          border: 1px solid var(--preview-border);
        }
        .mock-btn.secondary:hover {
          border-color: var(--preview-accent);
          color: var(--preview-accent);
        }
        .mock-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .mock-card {
          background: var(--preview-card);
          border: 1px solid var(--preview-border);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--preview-shadow);
          transition: all 0.3s;
        }
        .mock-card:hover {
          transform: translateY(-5px);
          border-color: var(--preview-accent);
        }
        .mock-card-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }
        .mock-card h3 {
          margin: 0 0 0.5rem;
          font-size: 1.05rem;
          color: #fff;
        }
        .mock-card p {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.5;
          opacity: 0.7;
        }
        /* Product Styles */
        .mock-card.product {
          text-align: center;
        }
        .product-img {
          font-size: 3rem;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
          padding: 2rem 0;
          margin-bottom: 1rem;
        }
        .price {
          display: block;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--preview-secondary);
          margin-bottom: 1rem;
        }
        .cart-box {
          font-family: monospace;
          font-size: 0.8rem;
          border: 1px solid var(--preview-border);
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
        }
        /* Stats Styles */
        .stats-boxes {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .stat-box {
          background: var(--preview-card);
          border: 1px solid var(--preview-border);
          border-radius: 8px;
          padding: 1.2rem;
          text-align: center;
        }
        .stat-lbl {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 0.4rem;
        }
        .stat-num {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--preview-accent);
        }
        /* Chart dashboard styling */
        .chart-mockup {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 150px;
          border-bottom: 1px solid var(--preview-border);
          margin-top: 1.5rem;
          padding-bottom: 5px;
        }
        .chart-bar {
          width: 50px;
          background: var(--preview-secondary);
          border-radius: 4px 4px 0 0;
          animation: scaleBar 1s var(--bar-delay) cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: bottom;
          transform: scaleY(0);
          opacity: 0.85;
          transition: all 0.3s;
        }
        .chart-bar:hover {
          background: var(--preview-accent);
          opacity: 1;
        }
        @keyframes scaleBar {
          100% { transform: scaleY(1); }
        }
        @keyframes fadeInMock {
          0% { opacity:0; transform: translateY(10px); }
          100% { opacity:1; transform: translateY(0); }
        }
    `;

    if (fullDocument) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibe Builder Standalone Webpage</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: var(--preview-bg);
    }
    ${cssRules}
  </style>
</head>
<body>
  <div id="preview-frame-container">
    ${contentHTML}
  </div>
</body>
</html>`;
    }

    return `
      <style>
        ${cssRules}
      </style>
      <div id="preview-frame-container">
        ${contentHTML}
      </div>
    `;
  }

  bindMockupInteractions(layout, container) {
    if (!container) return;

    if (layout === 'shop') {
      const btns = container.querySelectorAll('.add-cart-btn');
      const counter = container.querySelector('#cart-counter');
      let count = 0;
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          count++;
          if (counter) counter.textContent = count;
          sfx.playSuccess();
          // Bounce effect on cart counter
          counter.style.transform = 'scale(1.3)';
          setTimeout(() => counter.style.transform = '', 200);
        });
      });
    }

    if (layout === 'portfolio' || layout === 'landing') {
      const actionBtn = container.querySelector('#btn-mock-action');
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          sfx.playSuccess();
          alert('🚀 Connection active! In a real application, this triggers your booking dispatcher workflow.');
        });
      }
    }

    if (layout === 'dashboard') {
      const optBtn = container.querySelector('#btn-mock-opt');
      if (optBtn) {
        optBtn.addEventListener('click', () => {
          sfx.playSuccess();
          optBtn.textContent = 'Calibrating...';
          optBtn.disabled = true;
          const bars = container.querySelectorAll('.chart-bar');
          bars.forEach(bar => {
            bar.style.height = `${Math.floor(Math.random() * 60) + 35}%`;
          });
          setTimeout(() => {
            optBtn.textContent = 'Optimize Clusters';
            optBtn.disabled = false;
          }, 1200);
        });
      }
    }

    if (layout === 'comingsoon') {
      const notifyBtn = container.querySelector('#btn-mock-notify');
      const emailInput = container.querySelector('#mock-notify-email');
      if (notifyBtn && emailInput) {
        notifyBtn.addEventListener('click', () => {
          const email = emailInput.value.trim();
          if (email) {
            sfx.playSuccess();
            alert(`📧 Added "${email}" to notification pipeline!`);
            emailInput.value = '';
          } else {
            sfx.playBlip();
            alert('Please enter a valid email address!');
          }
        });
      }
    }

    if (layout === 'pricing') {
      const tierBtns = container.querySelectorAll('.mock-checkout-btn');
      tierBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          sfx.playSuccess();
          alert(`💳 Checkout initialized for plan: [${btn.dataset.plan}]`);
        });
      });
    }
  }

  launchGameConfetti() {
    const colors = ['#00f5ff', '#7b2ff7', '#39ff14', '#fff'];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      const size = Math.random() * 8 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const startX = 40 + Math.random() * 20; // center
      const delay = Math.random() * 0.5;
      const duration = 1.5 + Math.random() * 1.5;
      const drift = (Math.random() - 0.5) * 400;

      el.style.cssText = `
        position: fixed;
        top: 30%;
        left: ${startX}vw;
        width: ${size}px;
        height: ${size * 0.4}px;
        background: ${color};
        border-radius: 2px;
        z-index: 99;
        animation: game-confetti ${duration}s ${delay}s ease-out forwards;
      `;
      const style = document.createElement('style');
      style.textContent = `@keyframes game-confetti {
        0%  { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
        100%{ transform: translateY(50vh) translateX(${drift}px) rotate(360deg); opacity: 0; }
      }`;
      document.head.appendChild(style);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), (duration + delay) * 1000);
    }
  }
}


// Initialize elements on load
document.addEventListener('DOMContentLoaded', () => {
  new FAQChatbot();
  new TerminalSimulator('terminal-log-container');
  new CheckInStatus();
  new CodingGame();
});
