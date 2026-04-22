// ── SURFER APP ──
let surferUser = null;
let surferClips = [];
let surferTimestamps = [];
let surferSnapshots = [];
let surferCurrentClipId = null;
let surferCompareMode = false;
let surferCompareClipAId = null;

async function initSurfer(user) {
  surferUser = user;
  document.getElementById('surferName').textContent = user.name;
  document.getElementById('surferWelcomeName').textContent = user.name.split(' ')[0];
  showScreen('surferHome');
  await loadSurferData();
  renderSurferClips();
  initProfilePlayer();
  initComparePlayer('A');
  initComparePlayer('B');
}

async function loadSurferData() {
  const [c, ts, sn] = await Promise.all([
    supabase.from('clips').select('*').eq('surfer_id', surferUser.id).order('created_at'),
    supabase.from('timestamps').select('*').in('clip_id', await getClipIds()).order('time_seconds'),
    supabase.from('snapshots').select('*').in('clip_id', await getClipIds()).order('created_at', { ascending: false }),
  ]);
  surferClips = c.data || [];
  surferTimestamps = ts.data || [];
  surferSnapshots = sn.data || [];
}

async function getClipIds() {
  const { data } = await supabase.from('clips').select('id').eq('surfer_id', surferUser.id);
  return (data || []).map(c => c.id);
}

function renderSurferClips() {
  const container = document.getElementById('surferClipsContainer');
  if (!container) return;
  container.innerHTML = '';

  if (!surferClips.length) {
    container.innerHTML = '<div class="empty-state"><div class="big-icon">🏄</div><h3>No clips yet</h3><p>Your coach will upload your session videos here.</p></div>';
    return;
  }

  const compareBtn = document.getElementById('surferCompareBtn');
  if (compareBtn) compareBtn.style.display = surferClips.length >= 2 ? 'inline-flex' : 'none';

  // Group by day
  const groups = {};
  const groupOrder = [];
  surferClips.forEach(c => {
    const label = c.day_label || 'Unassigned';
    if (!groups[label]) { groups[label] = []; groupOrder.push(label); }
    groups[label].push(c);
  });
  groupOrder.sort((a, b) => {
    const ai = DAYS.indexOf(a), bi = DAYS.indexOf(b);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  groupOrder.forEach(label => {
    const group = document.createElement('div');
    group.className = 'surfer-day-group';
    group.innerHTML = `<div class="surfer-day-label">${label}</div>`;
    groups[label].forEach(c => {
      const ts = surferTimestamps.filter(t => t.clip_id === c.id);
      const hasNotes = !!c.coach_notes;
      const card = document.createElement('div');
      card.className = 'surfer-clip-card';
      card.innerHTML = `
        <div class="clip-info">
          <span class="clip-icon">🎬</span>
          <span class="clip-title">${shortName(c.name)}</span>
        </div>
        <div class="clip-badges">
          ${ts.length ? `<span class="surfer-clip-badge has-ts">📍 ${ts.length} note${ts.length > 1 ? 's' : ''}</span>` : ''}
          ${hasNotes ? `<span class="surfer-clip-badge has-notes">📝 Coach notes</span>` : ''}
          ${surferCompareMode ? `<button class="btn btn-ghost btn-sm" onclick="surferSetCompare('${c.id}');event.stopPropagation()">+ Compare</button>` : ''}
          <span style="font-size:18px;color:var(--muted)">›</span>
        </div>`;
      card.addEventListener('click', () => surferOpenClip(c.id));
      group.appendChild(card);
    });
    container.appendChild(group);
  });
}

async function surferOpenClip(clipId) {
  surferCurrentClipId = clipId;
  const clip = surferClips.find(c => c.id === clipId);
  const timestamps = surferTimestamps.filter(t => t.clip_id === clipId).sort((a, b) => a.time_seconds - b.time_seconds);
  const snapshots = surferSnapshots.filter(s => s.clip_id === clipId);

  if (surferCompareMode && surferCompareClipAId) {
    // Set as Clip B
    const clipA = surferClips.find(c => c.id === surferCompareClipAId);
    const tsA = surferTimestamps.filter(t => t.clip_id === surferCompareClipAId);
    showScreen('profileScreen');
    document.getElementById('profileName').textContent = surferUser.name.split(' ')[0] + "'s Session";
    document.getElementById('profileAvatar').textContent = surferUser.name[0].toUpperCase();
    document.getElementById('profileClipCount').textContent = 'Compare Mode';
    document.getElementById('profileBody').style.display = 'flex';
    document.getElementById('clipsSidebar').style.display = 'none';
    document.getElementById('singleView').style.display = 'none';
    document.getElementById('compareWrap').classList.add('show');
    // Hide coach buttons
    ['compareToggleBtn','renameSurferBtn','deleteSurferBtn'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.getElementById('backFromProfile').onclick = () => surferGoHome();
    loadCompareSlot('A', clipA, tsA);
    loadCompareSlot('B', clip, timestamps);
    return;
  }

  if (surferCompareMode && !surferCompareClipAId) {
    surferCompareClipAId = clipId;
    toast('Clip A selected — now pick Clip B', 'info');
    return;
  }

  showScreen('profileScreen');
  document.getElementById('profileName').textContent = clip.day_label ? `${surferUser.name.split(' ')[0]} — ${clip.day_label}` : surferUser.name.split(' ')[0];
  document.getElementById('profileAvatar').textContent = surferUser.name[0].toUpperCase();
  document.getElementById('profileClipCount').textContent = shortName(clip.name);
  document.getElementById('profileBody').style.display = 'flex';
  document.getElementById('clipsSidebar').style.display = 'none';
  ['compareToggleBtn','renameSurferBtn','deleteSurferBtn'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  document.getElementById('backFromProfile').onclick = () => surferGoHome();
  document.getElementById('singleView').style.display = 'block';
  document.getElementById('compareWrap').classList.remove('show');

  const empty = document.getElementById('profileEmptyState');
  if (empty) empty.style.display = 'none';
  const wrap = document.getElementById('profileVideoWrap');
  if (wrap) wrap.style.display = 'block';

  loadProfileVideo(clip, timestamps, false);

  // Notes (read-only)
  const notesArea = document.getElementById('notesArea');
  const notesTA = document.getElementById('clipNotes');
  if (clip.coach_notes) {
    if (notesArea) notesArea.style.display = 'block';
    if (notesTA) { notesTA.value = clip.coach_notes; notesTA.readOnly = true; }
  } else {
    if (notesArea) notesArea.style.display = 'none';
  }

  // Snapshots
  const snapshotsSection = document.getElementById('snapshotsSection');
  if (snapshots.length) {
    if (snapshotsSection) snapshotsSection.style.display = 'block';
    const grid = document.getElementById('snapshotsGrid');
    if (grid) {
      grid.innerHTML = '';
      snapshots.forEach(s => {
        const div = document.createElement('div');
        div.className = 'snapshot-thumb';
        div.innerHTML = `<img src="${s.image_url}" alt="snapshot">`;
        div.addEventListener('click', () => window.open(s.image_url, '_blank'));
        grid.appendChild(div);
      });
    }
  } else {
    if (snapshotsSection) snapshotsSection.style.display = 'none';
  }
}

function surferToggleCompare() {
  surferCompareMode = !surferCompareMode;
  surferCompareClipAId = null;
  const btn = document.getElementById('surferCompareBtn');
  if (btn) {
    btn.textContent = surferCompareMode ? '✕ Exit Compare' : '⊞ Compare Clips';
    btn.style.background = surferCompareMode ? 'rgba(232,146,122,0.1)' : '';
    btn.style.color = surferCompareMode ? 'var(--coral)' : '';
  }
  if (surferCompareMode) toast('Select Clip A, then Clip B to compare', 'info');
  renderSurferClips();
}

function surferSetCompare(clipId) {
  if (!surferCompareClipAId) {
    surferCompareClipAId = clipId;
    toast('Clip A set — now pick Clip B', 'info');
  } else {
    surferOpenClip(clipId);
  }
}

function surferGoHome() {
  surferCompareMode = false;
  surferCompareClipAId = null;
  const btn = document.getElementById('surferCompareBtn');
  if (btn) { btn.textContent = '⊞ Compare Clips'; btn.style.background = ''; btn.style.color = ''; }
  showScreen('surferHome');
  renderSurferClips();
  // Reset profile screen for next use
  const sidebar = document.getElementById('clipsSidebar');
  if (sidebar) sidebar.style.display = '';
}
