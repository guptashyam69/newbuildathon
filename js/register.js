/* ============================================================
   BUILDATHON — REGISTRATION FORM (Team Leader)
   Apps Script Endpoint: set SCRIPT_URL below
   ============================================================ */

// ⚠️  REPLACE THIS WITH YOUR DEPLOYED APPS SCRIPT WEB APP URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywx-ISL3pZTnv54Zjw3daLaojaIsUG9lK1YLcVan_rDn7WZiLx1cAfHaxI6NM_ZUqNEA/exec';

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('registration-form');
  const submitBtn = document.getElementById('submit-btn');
  const formWrapper = document.getElementById('form-wrapper');
  const successPanel = document.getElementById('success-panel');
  const errorMsg = document.getElementById('error-msg');

  /* ── Input focus FX ───────────────────────────────────── */
  document.querySelectorAll('.form-input, .form-select').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });

  /* ── Real-time Validation ─────────────────────────────── */
  function validateField(field) {
    const val = field.value.trim();
    const type = field.type;
    let valid = true;
    let msg = '';

    if (field.required && !val) { valid = false; msg = 'This field is required.'; }
    else if (type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      valid = false; msg = 'Enter a valid email address.';
    } else if (type === 'tel' && val && !/^[6-9]\d{9}$/.test(val)) {
      valid = false; msg = 'Enter a valid 10-digit Indian mobile number.';
    }

    const errEl = field.parentElement.querySelector('.field-error');
    if (errEl) { errEl.textContent = msg; errEl.style.display = msg ? 'block' : 'none'; }
    field.style.borderColor = !valid && val ? 'var(--neon-pink)' : '';
    return valid;
  }

  document.querySelectorAll('.form-input[required], .form-select[required]').forEach(f => {
    f.addEventListener('input', () => validateField(f));
    f.addEventListener('blur', () => validateField(f));
  });

  /* ── Submit Handler ───────────────────────────────────── */
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate all
      let allValid = true;
      form.querySelectorAll('[required]').forEach(f => {
        if (!validateField(f)) allValid = false;
      });
      if (!allValid) {
        shakeForm();
        return;
      }

      // Show loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Registering...';
      if (errorMsg) errorMsg.style.display = 'none';

      const teamId = btoa(form.leaderEmail.value.trim() + form.teamName.value.trim()).slice(0, 12).toUpperCase();

      const data = {
        action: 'registerLeader',
        teamId: teamId,
        teamName: form.teamName.value.trim(),
        leaderName: form.leaderName.value.trim(),
        leaderEmail: form.leaderEmail.value.trim(),
        leaderPhone: form.leaderPhone.value.trim(),
        college: form.college.value.trim(),
        classYear: form.classYear.value.trim(),
        track: form.track.value,
        teamSize: form.teamSize.value,
        timestamp: new Date().toISOString(),
      };

      try {
        const resp = await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(data),
        });

        // no-cors response is always opaque; treat as success
        sessionStorage.setItem('buildathon_team', JSON.stringify(data));

        // Show success
        if (formWrapper) formWrapper.style.display = 'none';
        if (successPanel) {
          successPanel.style.display = 'block';
          document.getElementById('sp-team-id').textContent = teamId;
          document.getElementById('sp-team-name').textContent = data.teamName;
          document.getElementById('sp-leader').textContent = data.leaderName;
          document.getElementById('sp-track').textContent = data.track;
        }

        // Redirect after 3s
        setTimeout(() => {
          window.location.href = `add-members.html?tid=${teamId}`;
        }, 3000);

      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🚀</span> Submit Registration';
        if (errorMsg) {
          errorMsg.textContent = 'Network error. Please check your connection and try again.';
          errorMsg.style.display = 'block';
        }
      }
    });
  }

  function shakeForm() {
    form.style.animation = 'shake 0.5s ease';
    setTimeout(() => form.style.animation = '', 500);
    const style = document.createElement('style');
    style.textContent = `@keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-8px)}
      40%{transform:translateX(8px)}
      60%{transform:translateX(-5px)}
      80%{transform:translateX(5px)}
    }`;
    document.head.appendChild(style);
  }

  /* ── Team size toggle ─────────────────────────────────── */
  const teamSizeEl = document.getElementById('teamSize');
  if (teamSizeEl) {
    teamSizeEl.addEventListener('change', () => {
      const note = document.getElementById('team-size-note');
      if (note) note.textContent = `You can add ${+teamSizeEl.value - 1} more member(s) in the next step.`;
    });
  }
});
