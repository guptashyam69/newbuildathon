/* ============================================================
   BUILDATHON — ADD MEMBERS + EMAIL TRIGGER
   ============================================================ */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywx-ISL3pZTnv54Zjw3daLaojaIsUG9lK1YLcVan_rDn7WZiLx1cAfHaxI6NM_ZUqNEA/exec';
const MAX_MEMBERS = 3;

document.addEventListener('DOMContentLoaded', () => {

  /* ── Load team info from session ──────────────────────── */
  const teamData = JSON.parse(sessionStorage.getItem('buildathon_team') || '{}');
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get('tid') || teamData.teamId || 'N/A';

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('team-id-display', teamId);
  setEl('team-name-display', teamData.teamName || '—');
  setEl('leader-name-display', teamData.leaderName || '—');
  setEl('track-display', teamData.track || '—');

  /* ── Dynamic Member Rows ──────────────────────────────── */
  const membersContainer = document.getElementById('members-container');
  const addMemberBtn = document.getElementById('add-member-btn');
  let memberCount = 1;

  function createMemberRow(index) {
    const row = document.createElement('div');
    row.className = 'member-row reveal';
    row.id = `member-${index}`;
    row.innerHTML = `
      <div class="member-row-header">
        <div class="member-row-number">
          <span class="member-num-badge">${index}</span>
          <span class="text-mono" style="font-size:0.8rem;color:var(--text-secondary)">Team Member ${index}</span>
        </div>
        ${index > 1 ? `<button type="button" class="remove-member-btn" onclick="removeMember('member-${index}')">✕ Remove</button>` : ''}
      </div>
      <div class="member-fields-grid">
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input type="text" class="form-input member-name" name="member${index}Name" placeholder="Enter full name" required>
          <span class="field-error"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Email Address *</label>
          <input type="email" class="form-input member-email" name="member${index}Email" placeholder="member@email.com" required>
          <span class="field-error"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Class / Year *</label>
          <input type="text" class="form-input member-class" name="member${index}Class" placeholder="e.g. 3rd Year B.Tech CS" required>
          <span class="field-error"></span>
        </div>
        <div class="form-group">
          <label class="form-label">College / Institution *</label>
          <input type="text" class="form-input member-college" name="member${index}College" placeholder="College name" required>
          <span class="field-error"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="tel" class="form-input member-phone" name="member${index}Phone" placeholder="10-digit mobile">
          <span class="field-error"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Role in Team</label>
          <select class="form-select form-input member-role" name="member${index}Role">
            <option value="">Select role</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Full Stack Developer</option>
            <option>ML / AI Engineer</option>
            <option>UI/UX Designer</option>
            <option>Data Analyst</option>
            <option>DevOps Engineer</option>
            <option>Project Manager</option>
            <option>Business Analyst</option>
            <option>Other</option>
          </select>
        </div>
      </div>
    `;
    setTimeout(() => row.classList.add('visible'), 50);
    return row;
  }

  // Initialise with 1 member
  membersContainer.appendChild(createMemberRow(1));

  window.removeMember = (id) => {
    const row = document.getElementById(id);
    if (row) { row.style.opacity = '0'; row.style.transform = 'translateX(-20px)'; setTimeout(() => row.remove(), 300); }
    memberCount--;
    if (addMemberBtn) addMemberBtn.style.display = memberCount < MAX_MEMBERS ? 'flex' : 'none';
    updateMemberCount();
  };

  addMemberBtn?.addEventListener('click', () => {
    if (memberCount >= MAX_MEMBERS) return;
    memberCount++;
    membersContainer.appendChild(createMemberRow(memberCount));
    if (memberCount >= MAX_MEMBERS && addMemberBtn) addMemberBtn.style.display = 'none';
    updateMemberCount();
  });

  function updateMemberCount() {
    const cnt = document.getElementById('member-count');
    if (cnt) cnt.textContent = memberCount;
  }

  /* ── Form Submit ──────────────────────────────────────── */
  const form = document.getElementById('members-form');
  const submitBtn = document.getElementById('members-submit-btn');
  const successPanel = document.getElementById('members-success');
  const errorMsg = document.getElementById('members-error');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect members
    const members = [];
    let valid = true;
    document.querySelectorAll('.member-row').forEach((row, i) => {
      const name = row.querySelector('.member-name')?.value.trim();
      const email = row.querySelector('.member-email')?.value.trim();
      const cls = row.querySelector('.member-class')?.value.trim();
      const college = row.querySelector('.member-college')?.value.trim();
      const phone = row.querySelector('.member-phone')?.value.trim();
      const role = row.querySelector('.member-role')?.value;

      if (!name || !email || !cls || !college) { valid = false; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { valid = false; }
      members.push({ name, email, cls, college, phone, role, index: i + 1 });
    });

    if (!valid) {
      if (errorMsg) { errorMsg.textContent = 'Please fill all required fields correctly.'; errorMsg.style.display = 'block'; }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending Emails & Saving...';
    if (errorMsg) errorMsg.style.display = 'none';

    const payload = {
      action: 'addMembers',
      teamId,
      teamName: teamData.teamName,
      leaderName: teamData.leaderName,
      leaderEmail: teamData.leaderEmail,
      track: teamData.track,
      members,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      // Show success
      form.parentElement.style.display = 'none';
      if (successPanel) {
        successPanel.style.display = 'block';
        document.getElementById('final-team-id').textContent = teamId;
        document.getElementById('final-members-count').textContent = members.length;
        // Confetti
        launchConfetti();
      }
      sessionStorage.clear();

    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '📧 Save Team & Send Emails';
      if (errorMsg) { errorMsg.textContent = 'Error submitting. Please try again.'; errorMsg.style.display = 'block'; }
    }
  });

  /* ── Confetti ─────────────────────────────────────────── */
  function launchConfetti() {
    const colors = ['#00f5ff', '#7b2ff7', '#39ff14', '#ff2d78', '#ff6b00', '#fff'];
    for (let i = 0; i < 120; i++) {
      const el = document.createElement('div');
      const size = Math.random() * 10 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const startX = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const duration = 1 + Math.random() * 2;
      const rotate = Math.random() * 720;
      const drift = (Math.random() - 0.5) * 200;

      el.style.cssText = `
        position: fixed;
        top: -20px;
        left: ${startX}vw;
        width: ${size}px;
        height: ${size * 0.4}px;
        background: ${color};
        border-radius: 2px;
        z-index: 9999;
        animation: confetti-fall ${duration}s ${delay}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        transform-origin: center;
      `;
      const style = document.createElement('style');
      style.textContent = `@keyframes confetti-fall {
        0%  { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
        100%{ transform: translateY(100vh) translateX(${drift}px) rotate(${rotate}deg); opacity: 0; }
      }`;
      document.head.appendChild(style);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), (duration + delay + 0.5) * 1000);
    }
  }
});
