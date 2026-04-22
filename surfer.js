// ── SHARED UTILS ──

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function fmt(t) {
  t = t || 0;
  return Math.floor(t / 60) + ':' + Math.floor(t % 60).toString().padStart(2, '0');
}

function shortName(n) {
  return n && n.length > 18 ? n.slice(0, 17) + '…' : (n || '');
}

let toastTimer;
function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.className = '', 3000);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

// ── CUSTOM VIDEO PLAYER (profile view) ──
const pSpeeds = [0.25, 0.5, 1, 1.5, 2];
let pSpeedIdx = 2;
let lastShownTsId = null;
let tsOverlayTimer = null;
let profileTimestamps = []; // loaded per clip

function initProfilePlayer(onSeek) {
  const vid = document.getElementById('profileVideo');
  const wrap = document.getElementById('profileVideoWrap');
  const fill = document.getElementById('profileSeekFill');
  const thumb = document.getElementById('profileSeekThumb');
  const timeDisp = document.getElementById('profileTimeDisplay');
  const seekWrap = document.getElementById('profileSeekWrap');

  vid.addEventListener('loadedmetadata', () => {
    wrap.classList.add('loaded');
    renderSeekDots(seekWrap, vid, profileTimestamps);
  });

  vid.addEventListener('timeupdate', () => {
    if (!vid.duration) return;
    const pct = (vid.currentTime / vid.duration) * 100;
    fill.style.width = pct + '%';
    thumb.style.left = pct + '%';
    timeDisp.textContent = fmt(vid.currentTime) + ' / ' + fmt(vid.duration);
    // Timestamp overlay
    if (!vid.paused) {
      for (const t of profileTimestamps) {
        const diff = vid.currentTime - t.time_seconds;
        if (diff >= 0 && diff < 0.35 && lastShownTsId !== t.id) {
          lastShownTsId = t.id;
          showTsOverlay(t.time_seconds, t.note);
          clearTimeout(tsOverlayTimer);
          tsOverlayTimer = setTimeout(hideTsOverlay, 2500);
        }
      }
    }
  });

  vid.addEventListener('play',  () => { const b = document.getElementById('pPlayBtn'); if (b) b.textContent = '⏸'; });
  vid.addEventListener('pause', () => { const b = document.getElementById('pPlayBtn'); if (b) b.textContent = '▶'; });
  vid.addEventListener('ended', () => { const b = document.getElementById('pPlayBtn'); if (b) b.textContent = '▶'; });

  let seeking = false;
  function seekTo(e) {
    const r = seekWrap.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    if (vid.duration) { vid.currentTime = pct * vid.duration; if (onSeek) onSeek(); }
  }
  seekWrap.addEventListener('mousedown', e => { seeking = true; lastShownTsId = null; hideTsOverlay(); seekTo(e); });
  window.addEventListener('mousemove', e => { if (seeking) seekTo(e); });
  window.addEventListener('mouseup', () => { seeking = false; });
  seekWrap.addEventListener('touchstart', e => { seeking = true; seekTo(e.touches[0]); }, { passive: true });
  window.addEventListener('touchmove', e => { if (seeking) seekTo(e.touches[0]); }, { passive: true });
  window.addEventListener('touchend', () => { seeking = false; });
}

function pTogglePlay() {
  const vid = document.getElementById('profileVideo');
  if (vid) vid.paused ? vid.play() : vid.pause();
}
function pStep(dir) {
  const vid = document.getElementById('profileVideo');
  if (!vid) return;
  vid.pause();
  vid.currentTime = Math.max(0, Math.min(vid.duration || 0, vid.currentTime + dir / 30));
}
function pCycleSpeed() {
  pSpeedIdx = (pSpeedIdx + 1) % pSpeeds.length;
  const vid = document.getElementById('profileVideo');
  if (vid) vid.playbackRate = pSpeeds[pSpeedIdx];
  const btn = document.getElementById('profileSpeedBtn');
  if (btn) btn.textContent = pSpeeds[pSpeedIdx] + '×';
}

function showTsOverlay(time, note) {
  const el = document.getElementById('tsOverlay');
  if (!el) return;
  document.getElementById('tsOverlayTime').textContent = fmt(time);
  document.getElementById('tsOverlayNote').textContent = note;
  el.classList.add('visible');
}
function hideTsOverlay() {
  const el = document.getElementById('tsOverlay');
  if (el) el.classList.remove('visible');
}

function renderSeekDots(seekWrap, vid, timestamps) {
  seekWrap.querySelectorAll('.seek-ts-dot').forEach(d => d.remove());
  if (!timestamps.length || !vid.duration) return;
  timestamps.forEach(t => {
    const pct = Math.min(100, Math.max(0, (t.time_seconds / vid.duration) * 100));
    const dot = document.createElement('div');
    dot.className = 'seek-ts-dot';
    dot.style.left = pct + '%';
    dot.innerHTML = `<div class="seek-ts-tooltip"><span class="tt-time">${fmt(t.time_seconds)}</span>${t.note}</div>`;
    dot.addEventListener('click', e => {
      e.stopPropagation();
      vid.currentTime = t.time_seconds;
      vid.play();
    });
    seekWrap.appendChild(dot);
  });
}

function loadProfileVideo(clip, timestamps, isCoach) {
  const wrap = document.getElementById('profileVideoWrap');
  const vid = document.getElementById('profileVideo');
  if (!wrap || !vid) return;

  profileTimestamps = timestamps || [];
  lastShownTsId = null;
  hideTsOverlay();
  wrap.classList.remove('loaded');
  pSpeedIdx = 2;
  const speedBtn = document.getElementById('profileSpeedBtn');
  if (speedBtn) speedBtn.textContent = '1×';
  const fill = document.getElementById('profileSeekFill');
  const thumb = document.getElementById('profileSeekThumb');
  const timeDisp = document.getElementById('profileTimeDisplay');
  if (fill) fill.style.width = '0%';
  if (thumb) thumb.style.left = '0%';
  if (timeDisp) timeDisp.textContent = '0:00 / 0:00';
  document.getElementById('profileSeekWrap')?.querySelectorAll('.seek-ts-dot').forEach(d => d.remove());

  vid.playbackRate = 1;
  if (clip.video_url) {
    vid.src = clip.video_url;
  } else {
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = 'block';

  // Retry dots after load
  vid.addEventListener('loadedmetadata', () => {
    const sw = document.getElementById('profileSeekWrap');
    if (sw) renderSeekDots(sw, vid, profileTimestamps);
  }, { once: true });
  setTimeout(() => {
    if (vid.duration) {
      const sw = document.getElementById('profileSeekWrap');
      if (sw) renderSeekDots(sw, vid, profileTimestamps);
    }
  }, 500);
}

// ── COMPARE PLAYERS ──
const cmpSpeeds = [0.25, 0.5, 1, 1.5, 2];
const cmpState = {
  A: { speedIdx: 2, clipId: null, lastShownTsId: null, timer: null, timestamps: [] },
  B: { speedIdx: 2, clipId: null, lastShownTsId: null, timer: null, timestamps: [] }
};

function initComparePlayer(slot) {
  const vid = document.getElementById('compareVideo' + slot);
  const fill = document.getElementById('cmpFill' + slot);
  const thumb = document.getElementById('cmpThumb' + slot);
  const timeEl = document.getElementById('cmpTime' + slot);
  const seekWrap = document.getElementById('cmpSeek' + slot);
  if (!vid || !seekWrap) return;
  const playBtn = seekWrap.closest('.cmp-player-controls')?.querySelector('.p-ctrl-btn');
  const st = cmpState[slot];

  vid.addEventListener('loadedmetadata', () => renderSeekDots(seekWrap, vid, st.timestamps));
  vid.addEventListener('timeupdate', () => {
    if (!vid.duration) return;
    const pct = (vid.currentTime / vid.duration) * 100;
    if (fill) fill.style.width = pct + '%';
    if (thumb) thumb.style.left = pct + '%';
    if (timeEl) timeEl.textContent = fmt(vid.currentTime) + ' / ' + fmt(vid.duration);
    if (!vid.paused && st.clipId) {
      for (const t of st.timestamps) {
        const diff = vid.currentTime - t.time_seconds;
        if (diff >= 0 && diff < 0.35 && st.lastShownTsId !== t.id) {
          st.lastShownTsId = t.id;
          const ot = document.getElementById('cmpOverlayTime' + slot);
          const on_ = document.getElementById('cmpOverlayNote' + slot);
          const ov = document.getElementById('cmpOverlay' + slot);
          if (ot) ot.textContent = fmt(t.time_seconds);
          if (on_) on_.textContent = t.note;
          if (ov) ov.classList.add('visible');
          clearTimeout(st.timer);
          st.timer = setTimeout(() => {
            const ov2 = document.getElementById('cmpOverlay' + slot);
            if (ov2) ov2.classList.remove('visible');
          }, 2500);
        }
      }
    }
  });
  if (playBtn) {
    vid.addEventListener('play',  () => playBtn.textContent = '⏸');
    vid.addEventListener('pause', () => playBtn.textContent = '▶');
    vid.addEventListener('ended', () => playBtn.textContent = '▶');
  }

  let seeking = false;
  function seekTo(e) {
    const r = seekWrap.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    if (vid.duration) vid.currentTime = pct * vid.duration;
  }
  seekWrap.addEventListener('mousedown', e => { seeking = true; st.lastShownTsId = null; const ov = document.getElementById('cmpOverlay'+slot); if(ov) ov.classList.remove('visible'); seekTo(e); });
  window.addEventListener('mousemove', e => { if (seeking) seekTo(e); });
  window.addEventListener('mouseup', () => { seeking = false; });
}

function cmpTogglePlay(slot) {
  const vid = document.getElementById('compareVideo' + slot);
  if (vid) vid.paused ? vid.play() : vid.pause();
}
function cmpCycleSpeed(slot) {
  const st = cmpState[slot];
  st.speedIdx = (st.speedIdx + 1) % cmpSpeeds.length;
  const vid = document.getElementById('compareVideo' + slot);
  if (vid) vid.playbackRate = cmpSpeeds[st.speedIdx];
  const btn = document.getElementById('cmpSpeed' + slot);
  if (btn) btn.textContent = cmpSpeeds[st.speedIdx] + '×';
}

function loadCompareSlot(slot, clip, timestamps) {
  const st = cmpState[slot];
  st.clipId = clip.id;
  st.timestamps = timestamps || [];
  st.lastShownTsId = null;
  const ov = document.getElementById('cmpOverlay' + slot);
  if (ov) ov.classList.remove('visible');
  const vid = document.getElementById('compareVideo' + slot);
  if (!vid) return;
  if (clip.video_url) vid.src = clip.video_url;
  const label = document.getElementById('slotLabel' + slot);
  if (label) label.textContent = shortName(clip.name);
  const seekWrap = document.getElementById('cmpSeek' + slot);
  setTimeout(() => { if (vid.duration && seekWrap) renderSeekDots(seekWrap, vid, st.timestamps); }, 500);
}

// ── MODAL ──
let modalCallback = null;
function openModal(title, fields, confirmText, cb) {
  modalCallback = cb;
  const modal = document.getElementById('modal');
  if (!modal) return;
  let fieldsHtml = '';
  fields.forEach(f => {
    if (f.type === 'select') {
      fieldsHtml += `<div class="form-field"><label>${f.label}</label><select id="mf_${f.key}">${f.options.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>`;
    } else if (f.type === 'hint') {
      fieldsHtml += `<p class="modal-hint">${f.text}</p>`;
    } else {
      fieldsHtml += `<div class="form-field"><label>${f.label}</label><input type="${f.type||'text'}" id="mf_${f.key}" placeholder="${f.placeholder||''}" value="${f.value||''}"></div>`;
    }
  });
  modal.innerHTML = `
    <h3>${title}</h3>
    ${fieldsHtml}
    <div id="modalError" style="color:var(--coral);font-size:12px;min-height:16px"></div>
    <div class="modal-row">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="confirmModal()">${confirmText}</button>
    </div>`;
  document.getElementById('modalOverlay').classList.add('show');
  const first = modal.querySelector('input, select');
  if (first) setTimeout(() => first.focus(), 60);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
  modalCallback = null;
}

async function confirmModal() {
  if (!modalCallback) return;
  const modal = document.getElementById('modal');
  const inputs = modal.querySelectorAll('input, select');
  const values = {};
  inputs.forEach(inp => { values[inp.id.replace('mf_', '')] = inp.value.trim(); });
  const errEl = document.getElementById('modalError');
  try {
    if (errEl) errEl.textContent = '';
    await modalCallback(values);
    closeModal();
  } catch(e) {
    if (errEl) errEl.textContent = e.message || 'Something went wrong';
  }
}

// Enter key confirm
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('modalOverlay')?.classList.contains('show')) {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT')) confirmModal();
  }
  if (e.key === 'Escape' && document.getElementById('modalOverlay')?.classList.contains('show')) closeModal();
});
document.getElementById('modalOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});
