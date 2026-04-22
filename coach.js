// ── COACH APP ──
let currentUser = null;
let surfers = [];
let allClips = [];
let allTimestamps = [];
let allSnapshots = [];
let currentSurferId = null;
let currentClipId = null;
let compareMode = false;
let unassigned = [];

// Analyzer state
let aTool_ = 'pen', aColor_ = '#e8927a', aStrokeW = 4, aOpacity_ = 0.9;
let aDrawing = false, aStartX, aStartY, aAnnotations = [], aCurrentPath = [], aPreview = null, aTextInput_ = null;
let aSpeeds = [0.25, 0.5, 1, 1.5, 2], aSpeedIdx = 2;
let analyzerClipId = null;
let tsPendingTime = 0;
let tsPanelOpen = false;

// ── INIT ──
async function initCoach(user) {
  currentUser = user;
  document.getElementById('navUserName').textContent = user.name;
  showScreen('coachHome');
  await loadAll();
  renderHome();
  initProfilePlayer(() => { lastShownTsId = null; hideTsOverlay(); });
  initComparePlayer('A');
  initComparePlayer('B');
}

async function loadAll() {
  const [s, c, ts, sn] = await Promise.all([
    db.from('profiles').select('*').eq('role', 'surfer').order('name'),
    db.from('clips').select('*').order('created_at', { ascending: false }),
    db.from('timestamps').select('*').order('time_seconds'),
    db.from('snapshots').select('*').order('created_at', { ascending: false }),
  ]);
  surfers = s.data || [];
  allClips = c.data || [];
  allTimestamps = ts.data || [];
  allSnapshots = sn.data || [];
}

// ── HOME ──
function renderHome() {
  const grid = document.getElementById('surferGrid');
  if (!grid) return;
  grid.innerHTML = '';
  surfers.forEach(s => {
    const clips = allClips.filter(c => c.surfer_id === s.id);
    const card = document.createElement('div');
    card.className = 'surfer-card';
    card.innerHTML = `
      <div class="card-drop-hint">Drop clips here ↓</div>
      <div class="card-header">
        <div class="surfer-avatar">${s.name[0].toUpperCase()}</div>
        <div class="surfer-info">
          <div class="surfer-name">${s.name}</div>
          <div class="surfer-meta">${clips.length} clip${clips.length !== 1 ? 's' : ''} · ${s.email && !s.email.includes('placeholder') ? '✓ Can log in' : 'No login yet'}</div>
        </div>
        <div class="card-actions" onclick="event.stopPropagation()">
          ${!s.email || s.email.includes('placeholder') ? `<div class="card-icon-btn" onclick="openInviteSurfer('${s.id}')" title="Invite to app">✉️</div>` : ''}
          <div class="card-icon-btn del" onclick="deleteSurfer('${s.id}')">✕</div>
        </div>
      </div>
      <div class="card-clips">
        ${clips.slice(0, 5).map(c => `<div class="card-clip-thumb"><div class="dot"></div>${shortName(c.name)}</div>`).join('')}
        ${clips.length > 5 ? `<div class="card-clip-thumb">+${clips.length - 5} more</div>` : ''}
      </div>`;
    card.addEventListener('click', () => openProfile(s.id));
    card.addEventListener('dragover', e => { e.preventDefault(); card.classList.add('drop-target'); });
    card.addEventListener('dragleave', () => card.classList.remove('drop-target'));
    card.addEventListener('drop', e => { e.preventDefault(); card.classList.remove('drop-target'); handleDropOnSurfer(e, s.id); });
    grid.appendChild(card);
  });
  // Add surfer card
  const add = document.createElement('div');
  add.className = 'add-surfer-card';
  add.innerHTML = '<div class="plus">+</div><div>Add Surfer</div>';
  add.onclick = openAddSurfer;
  grid.appendChild(add);
  renderUnassigned();
}

// ── BULK UPLOAD ──
function handleBulkDragOver(e) { e.preventDefault(); document.getElementById('bulkDropZone').classList.add('drag-over'); }
function handleBulkDrop(e) {
  e.preventDefault();
  document.getElementById('bulkDropZone').classList.remove('drag-over');
  addToUnassigned(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('video/')));
}
function handleBulkFiles(files) { addToUnassigned(Array.from(files).filter(f => f.type.startsWith('video/'))); }

function addToUnassigned(files) {
  files.forEach(f => unassigned.push({ id: 'u_' + Date.now() + '_' + Math.random(), name: f.name, file: f, url: URL.createObjectURL(f) }));
  renderUnassigned();
  if (files.length) toast(`${files.length} clip${files.length > 1 ? 's' : ''} ready to assign`, 'info');
}

let selectedClipIds = new Set();

function renderUnassigned() {
  const tray = document.getElementById('clipTray');
  const badge = document.getElementById('unassignedCount');
  if (!tray) return;
  tray.innerHTML = '';
  if (!unassigned.length) { badge?.classList.remove('show'); return; }
  if (badge) { badge.textContent = unassigned.length; badge.classList.add('show'); }
  unassigned.forEach(u => {
    const chip = document.createElement('div');
    const isSelected = selectedClipIds.has(u.id);
    chip.className = 'clip-chip' + (isSelected ? ' selected' : '');
    chip.draggable = true;
    chip.innerHTML = `
      <span class="chip-check" onclick="toggleChipSelect('${u.id}',event)">${isSelected ? '✓' : '○'}</span>
      🎬 ${shortName(u.name)}
      <span class="chip-del" onclick="removeUnassigned('${u.id}',event)">✕</span>`;
    chip.addEventListener('dragstart', e => {
      e.dataTransfer.setData('unassignedId', u.id);
      // If this chip is selected, also mark all selected for upload
      if (!selectedClipIds.has(u.id)) {
        selectedClipIds.clear();
        selectedClipIds.add(u.id);
      }
      chip.classList.add('dragging');
    });
    chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
    tray.appendChild(chip);
  });
  // Show selected count hint
  if (selectedClipIds.size > 1) {
    const hint = document.createElement('span');
    hint.style.cssText = 'font-size:11px;color:var(--coral);white-space:nowrap;align-self:center;';
    hint.textContent = `${selectedClipIds.size} selected — drag any to assign all`;
    tray.appendChild(hint);
  }
}

function toggleChipSelect(id, e) {
  e.stopPropagation();
  if (selectedClipIds.has(id)) selectedClipIds.delete(id);
  else selectedClipIds.add(id);
  renderUnassigned();
}

function removeUnassigned(id, e) {
  e.stopPropagation();
  unassigned = unassigned.filter(u => u.id !== id);
  renderUnassigned();
}

async function handleDropOnSurfer(e, surferId) {
  const uid = e.dataTransfer.getData('unassignedId');
  const u = unassigned.find(x => x.id === uid);
  if (!u) return;
  await uploadClipToSurfer(u, surferId);
}

async function uploadClipToSurfer(u, surferId) {
  showUploadProgress(true, u.name, 0);
  try {
    // Upload to Supabase storage
    const path = `${surferId}/${Date.now()}_${u.name}`;
    const { data: storageData, error: storageErr } = await db.storage
      .from(VIDEO_BUCKET)
      .upload(path, u.file, {
        onUploadProgress: (p) => {
          showUploadProgress(true, u.name, Math.round((p.loaded / p.total) * 100));
        }
      });
    if (storageErr) throw storageErr;

    // Get public URL
    const { data: { publicUrl } } = db.storage.from(VIDEO_BUCKET).getPublicUrl(path);

    // Insert clip record
    const { data: clip, error: clipErr } = await db
      .from('clips')
      .insert({ name: u.name, surfer_id: surferId, video_url: publicUrl, storage_path: path })
      .select().single();
    if (clipErr) throw clipErr;

    allClips.push(clip);
    unassigned = unassigned.filter(x => x.id !== u.id);
    showUploadProgress(false);
    renderHome();
    renderUnassigned();
    if (currentSurferId === surferId) renderProfile();
    const s = surfers.find(x => x.id === surferId);
    toast(`Uploaded to ${s?.name || 'surfer'}`, 'success');
  } catch(err) {
    showUploadProgress(false);
    toast('Upload failed: ' + err.message, 'error');
  }
}

function showUploadProgress(show, name = '', pct = 0) {
  const overlay = document.getElementById('uploadProgressOverlay');
  if (!overlay) return;
  if (!show) { overlay.classList.remove('show'); return; }
  overlay.classList.add('show');
  document.getElementById('uploadFileName').textContent = name;
  document.getElementById('uploadProgressBar').style.width = pct + '%';
  document.getElementById('uploadProgressPct').textContent = pct + '%';
}

// ── SURFER CRUD ──
function openAddSurfer() {
  openModal('Add Surfer', [
    { key: 'name', label: 'Surfer Name', placeholder: 'e.g. Sarah' },
    { type: 'hint', text: 'Just enter a name. You can invite them to log in later from their profile.' }
  ], 'Add Surfer', async (vals) => {
    if (!vals.name) throw new Error('Name is required');
    // Create a placeholder auth account with auto-generated credentials
    // Surfer can be invited to set their own password later
    const placeholderEmail = `${vals.name.toLowerCase().replace(/\s+/g,'')}${Date.now()}@siempreolas.placeholder`;
    const placeholderPw = Math.random().toString(36).slice(2) + 'Aa1!';
    const { data, error } = await db.auth.signUp({
      email: placeholderEmail,
      password: placeholderPw,
      options: { data: { name: vals.name, role: 'surfer' } }
    });
    if (error) throw error;
    // Profile is created by trigger — wait a moment then reload
    await new Promise(r => setTimeout(r, 800));
    await loadAll();
    renderHome();
    toast(`${vals.name} added!`, 'success');
  });
}

function openInviteSurfer(surferId) {
  const surfer = surfers.find(s => s.id === surferId);
  openModal('Invite to App', [
    { key: 'email', label: 'Their Email Address', type: 'email', placeholder: 'surfer@email.com' },
    { key: 'password', label: 'Set a Password for Them', type: 'password', placeholder: 'Min 6 characters' },
    { type: 'hint', text: `${surfer?.name} can log in at siempre-olas.vercel.app to view their clips and timestamps.` }
  ], 'Set Up Login', async (vals) => {
    if (!vals.email) throw new Error('Email is required');
    if (!vals.password || vals.password.length < 6) throw new Error('Password must be at least 6 characters');
    const { data, error } = await db.auth.signUp({
      email: vals.email,
      password: vals.password,
      options: { data: { name: surfer?.name, role: 'surfer' } }
    });
    if (error) throw error;
    await new Promise(r => setTimeout(r, 800));
    // Update the surfer's profile with real email
    await db.from('profiles').update({ email: vals.email }).eq('id', surferId);
    const s = surfers.find(x => x.id === surferId);
    if (s) s.email = vals.email;
    renderHome();
    toast(`Login set up for ${surfer?.name}!`, 'success');
  });
}

async function handleDropOnSurfer(e, surferId) {
  const uid = e.dataTransfer.getData('unassignedId');
  // If clips are selected, upload all selected; otherwise upload the dragged one
  const toUpload = selectedClipIds.size > 0
    ? unassigned.filter(u => selectedClipIds.has(u.id))
    : unassigned.filter(u => u.id === uid);
  if (!toUpload.length) return;
  selectedClipIds.clear();
  renderUnassigned();
  // Upload sequentially
  for (const u of toUpload) {
    await uploadClipToSurfer(u, surferId);
  }
}

async function deleteSurfer(surferId) {
  if (!confirm('Delete this surfer and all their clips? This cannot be undone.')) return;
  // Delete storage files
  const clips = allClips.filter(c => c.surfer_id === surferId);
  const paths = clips.map(c => c.storage_path).filter(Boolean);
  if (paths.length) await db.storage.from(VIDEO_BUCKET).remove(paths);
  // Delete DB records (cascades via FK)
  await db.from('profiles').delete().eq('id', surferId);
  await loadAll();
  renderHome();
  if (currentSurferId === surferId) goHome();
  toast('Surfer deleted', 'info');
}

// ── PROFILE ──
async function openProfile(surferId) {
  currentSurferId = surferId;
  currentClipId = null;
  compareMode = false;
  showScreen('profileScreen');

  const surfer = surfers.find(s => s.id === surferId);
  const clips = allClips.filter(c => c.surfer_id === surferId);

  document.getElementById('profileName').textContent = surfer?.name || '';
  document.getElementById('profileAvatar').textContent = surfer?.name?.[0]?.toUpperCase() || '?';
  document.getElementById('profileClipCount').textContent = `${clips.length} clip${clips.length !== 1 ? 's' : ''}`;
  document.getElementById('sidebarClipCount').textContent = clips.length;

  // Show/hide coach-only buttons
  const compareBtn = document.getElementById('compareToggleBtn');
  const renameBtn = document.getElementById('renameSurferBtn');
  const deleteBtn = document.getElementById('deleteSurferBtn');
  if (compareBtn) compareBtn.style.display = clips.length >= 2 ? 'inline-flex' : 'none';
  if (renameBtn) renameBtn.style.display = 'inline-flex';
  if (deleteBtn) deleteBtn.style.display = 'inline-flex';

  renderProfile();
  showClipView(null);
}

function renderProfile() {
  const clips = allClips.filter(c => c.surfer_id === currentSurferId);
  document.getElementById('profileClipCount').textContent = `${clips.length} clip${clips.length !== 1 ? 's' : ''}`;
  document.getElementById('sidebarClipCount').textContent = clips.length;
  const compareBtn = document.getElementById('compareToggleBtn');
  if (compareBtn) compareBtn.style.display = clips.length >= 2 ? 'inline-flex' : 'none';
  renderClipsSidebar(clips);
}

function renderClipsSidebar(clips) {
  const list = document.getElementById('clipsList');
  if (!list) return;
  list.innerHTML = '';
  if (!clips.length) {
    list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted);font-size:12px">No clips yet.<br>Drag videos from the upload tray.</div>';
    return;
  }
  const groups = {};
  const groupOrder = [];
  clips.forEach(c => {
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
    const hdr = document.createElement('div');
    hdr.className = 'day-group-header';
    hdr.textContent = label;
    list.appendChild(hdr);
    groups[label].forEach(c => {
      const item = document.createElement('div');
      item.className = 'clip-item' + (c.id === currentClipId ? ' active' : '');
      item.innerHTML = `
        <div class="clip-name">🎬 ${shortName(c.name)}</div>
        <div class="clip-actions-row">
          <button class="clip-action-btn analyze" onclick="openAnalyzer('${c.id}');event.stopPropagation()">Analyze</button>
          ${compareMode ? `<button class="clip-action-btn compare" onclick="setCompareSlot('${c.id}');event.stopPropagation()">+ Compare</button>` : ''}
          <button class="clip-action-btn" onclick="openDayModal('${c.id}');event.stopPropagation()">📅</button>
          <button class="clip-action-btn" onclick="deleteClip('${c.id}');event.stopPropagation()" style="color:var(--coral)">✕</button>
        </div>`;
      item.addEventListener('click', () => selectClip(c.id));
      list.appendChild(item);
    });
  });
}

async function selectClip(clipId) {
  currentClipId = clipId;
  if (compareMode) { setCompareA(clipId); return; }
  renderClipsSidebar(allClips.filter(c => c.surfer_id === currentSurferId));
  const clip = allClips.find(c => c.id === clipId);
  const timestamps = allTimestamps.filter(t => t.clip_id === clipId).sort((a, b) => a.time_seconds - b.time_seconds);
  const snapshots = allSnapshots.filter(s => s.clip_id === clipId);
  showClipView(clip, timestamps, snapshots, true);
}

function showClipView(clip, timestamps, snapshots, isCoach) {
  const empty = document.getElementById('profileEmptyState');
  const wrap = document.getElementById('profileVideoWrap');
  const notesArea = document.getElementById('notesArea');
  const snapshotsSection = document.getElementById('snapshotsSection');
  document.getElementById('singleView').style.display = 'block';
  document.getElementById('compareWrap').classList.remove('show');

  if (!clip) {
    if (empty) empty.style.display = 'flex';
    if (wrap) wrap.style.display = 'none';
    if (notesArea) notesArea.style.display = 'none';
    if (snapshotsSection) snapshotsSection.style.display = 'none';
    return;
  }

  if (empty) empty.style.display = 'none';
  loadProfileVideo(clip, timestamps, isCoach);

  if (notesArea) notesArea.style.display = 'block';
  const notesTA = document.getElementById('clipNotes');
  if (notesTA) notesTA.value = clip.coach_notes || '';

  // Coach notes are editable only by coach
  if (notesTA) notesTA.readOnly = !isCoach;

  // Snapshots
  if (snapshots && snapshots.length) {
    if (snapshotsSection) snapshotsSection.style.display = 'block';
    renderSnapshots(snapshots, clip.id, isCoach);
  } else {
    if (snapshotsSection) snapshotsSection.style.display = 'none';
  }
}

function renderSnapshots(snaps, clipId, isCoach) {
  const grid = document.getElementById('snapshotsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  snaps.forEach(s => {
    const div = document.createElement('div');
    div.className = 'snapshot-thumb';
    div.innerHTML = `<img src="${s.image_url}" alt="snapshot">${isCoach ? `<button class="snap-del" onclick="deleteSnapshot('${s.id}','${clipId}');event.stopPropagation()">✕</button>` : ''}`;
    div.addEventListener('click', () => window.open(s.image_url, '_blank'));
    grid.appendChild(div);
  });
}

async function saveClipNotes() {
  if (!currentClipId) return;
  const note = document.getElementById('clipNotes')?.value || '';
  await db.from('clips').update({ coach_notes: note }).eq('id', currentClipId);
  const clip = allClips.find(c => c.id === currentClipId);
  if (clip) clip.coach_notes = note;
}

async function deleteClip(clipId) {
  if (!confirm('Delete this clip?')) return;
  const clip = allClips.find(c => c.id === clipId);
  if (clip?.storage_path) await db.storage.from(VIDEO_BUCKET).remove([clip.storage_path]);
  await db.from('clips').delete().eq('id', clipId);
  allClips = allClips.filter(c => c.id !== clipId);
  allTimestamps = allTimestamps.filter(t => t.clip_id !== clipId);
  allSnapshots = allSnapshots.filter(s => s.clip_id !== clipId);
  if (currentClipId === clipId) { currentClipId = null; showClipView(null); }
  renderProfile();
  toast('Clip deleted', 'info');
}

// Day assignment
function openDayModal(clipId) {
  const clip = allClips.find(c => c.id === clipId);
  const allDays = [...DAYS, 'Unassigned'];
  openModal('Assign to Day', [
    { key: 'day', label: 'Day of Week', type: 'select', options: allDays.map(d => ({ value: d, label: d === 'Unassigned' ? '— Unassigned' : d })) }
  ], 'Assign', async (vals) => {
    const day = vals.day === 'Unassigned' ? null : vals.day;
    await db.from('clips').update({ day_label: day }).eq('id', clipId);
    const c = allClips.find(x => x.id === clipId);
    if (c) c.day_label = day;
    renderClipsSidebar(allClips.filter(c => c.surfer_id === currentSurferId));
    toast(day ? `Moved to ${day}` : 'Unassigned', 'success');
  });
  // Pre-select current day
  setTimeout(() => {
    const sel = document.getElementById('mf_day');
    if (sel && clip?.day_label) sel.value = clip.day_label;
  }, 60);
}

// Rename surfer
function renameSurfer() {
  const s = surfers.find(x => x.id === currentSurferId);
  openModal('Rename Surfer', [
    { key: 'name', label: 'Name', value: s?.name || '' }
  ], 'Save', async (vals) => {
    if (!vals.name) throw new Error('Name required');
    await db.from('profiles').update({ name: vals.name }).eq('id', currentSurferId);
    await loadAll();
    renderHome();
    openProfile(currentSurferId);
  });
}

// ── COMPARE ──
let compareClipAId = null;
function toggleCompareMode() {
  compareMode = !compareMode;
  const btn = document.getElementById('compareToggleBtn');
  if (btn) {
    btn.textContent = compareMode ? '✕ Exit Compare' : '⊞ Compare';
    btn.style.background = compareMode ? 'rgba(232,146,122,0.1)' : '';
    btn.style.color = compareMode ? 'var(--coral)' : '';
  }
  const sv = document.getElementById('singleView');
  const cw = document.getElementById('compareWrap');
  if (compareMode) {
    if (sv) sv.style.display = 'none';
    if (cw) cw.classList.add('show');
    compareClipAId = null;
    toast('Select Clip A from sidebar, then Clip B', 'info');
  } else {
    if (sv) sv.style.display = 'block';
    if (cw) cw.classList.remove('show');
    currentClipId = null;
    showClipView(null);
  }
  renderClipsSidebar(allClips.filter(c => c.surfer_id === currentSurferId));
}

function setCompareA(clipId) {
  compareClipAId = clipId;
  const clip = allClips.find(c => c.id === clipId);
  const timestamps = allTimestamps.filter(t => t.clip_id === clipId);
  loadCompareSlot('A', clip, timestamps);
  document.getElementById('slotLabelA').textContent = shortName(clip.name);
  toast('Clip A set — now pick Clip B', 'info');
}

function setCompareSlot(clipId) {
  if (!compareClipAId) {
    setCompareA(clipId);
  } else {
    const clip = allClips.find(c => c.id === clipId);
    const timestamps = allTimestamps.filter(t => t.clip_id === clipId);
    loadCompareSlot('B', clip, timestamps);
    document.getElementById('slotLabelB').textContent = shortName(clip.name);
  }
}

function goHome() {
  currentSurferId = null; currentClipId = null; compareMode = false;
  showScreen('coachHome');
  renderHome();
}

// ── ANALYZER ──
async function openAnalyzer(clipId) {
  const clip = allClips.find(c => c.id === clipId);
  if (!clip) return;
  analyzerClipId = clipId;
  aAnnotations = []; aCurrentPath = []; aPreview = null;
  aSpeedIdx = 2;
  tsPanelOpen = false;
  document.getElementById('analyzerTsPanel')?.classList.remove('show');
  document.getElementById('speedBtn').textContent = '1×';
  showScreen('analyzerScreen');
  const vid = document.getElementById('analyzerVideo');
  vid.src = clip.video_url;
  vid.load();
  vid.addEventListener('loadedmetadata', aResize, { once: true });
  aUpdateBadge();
}

function closeAnalyzer() {
  document.getElementById('analyzerVideo').pause();
  showScreen('profileScreen');
  // Re-render dots in case timestamps were added
  if (currentClipId) {
    const ts = allTimestamps.filter(t => t.clip_id === currentClipId);
    const vid = document.getElementById('profileVideo');
    const sw = document.getElementById('profileSeekWrap');
    if (vid && sw) {
      if (vid.duration) renderSeekDots(sw, vid, ts);
      else setTimeout(() => renderSeekDots(sw, vid, ts), 400);
    }
  }
}

function aResize() {
  const vid = document.getElementById('analyzerVideo');
  const main = document.getElementById('analyzerMain');
  const canvas = document.getElementById('analyzerCanvas');
  const r = main.getBoundingClientRect();
  const vr = vid.videoWidth / vid.videoHeight;
  const br = r.width / r.height;
  let w, h;
  if (vr > br) { w = r.width; h = w / vr; } else { h = r.height; w = h * vr; }
  vid.style.width = w + 'px'; vid.style.height = h + 'px';
  vid.style.left = ((r.width - w) / 2) + 'px'; vid.style.top = ((r.height - h) / 2) + 'px';
  canvas.width = r.width; canvas.height = r.height;
  aRedraw();
}
window.addEventListener('resize', () => {
  if (document.getElementById('analyzerScreen')?.classList.contains('active'))
    if (document.getElementById('analyzerVideo').videoWidth) aResize();
});

// Tools
function aTool(t) {
  aTool_ = t;
  document.querySelectorAll('[id^="abtn-"]').forEach(b => b.classList.remove('active'));
  document.getElementById('abtn-' + t)?.classList.add('active');
  const canvas = document.getElementById('analyzerCanvas');
  canvas.style.cursor = t === 'eraser' ? 'cell' : t === 'text' ? 'text' : 'crosshair';
}
function aColorFn(el) {
  aColor_ = el.dataset.color;
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}
document.getElementById('aStroke')?.addEventListener('input', e => aStrokeW = +e.target.value);
document.getElementById('aOpacity')?.addEventListener('input', e => aOpacity_ = e.target.value / 100);

// Canvas drawing
const aC = document.getElementById('analyzerCanvas');
const aCtx = aC?.getContext('2d');
function aGetPos(e) {
  const r = aC.getBoundingClientRect();
  const s = e.touches ? e.touches[0] : e;
  return { x: s.clientX - r.left, y: s.clientY - r.top };
}
aC?.addEventListener('pointerdown', e => {
  e.preventDefault(); const pos = aGetPos(e); aStartX = pos.x; aStartY = pos.y;
  if (aTool_ === 'text') { aSpawnText(pos.x, pos.y); return; }
  if (aTool_ === 'eraser') { aEraseAt(pos.x, pos.y); aDrawing = true; return; }
  aDrawing = true; aCurrentPath = [pos]; aPreview = null;
});
aC?.addEventListener('pointermove', e => {
  if (!aDrawing) return; e.preventDefault(); const pos = aGetPos(e);
  if (aTool_ === 'eraser') { aEraseAt(pos.x, pos.y); return; }
  if (aTool_ === 'pen') { aCurrentPath.push(pos); aRedraw(); aDrawPath(aCurrentPath, aColor_, aStrokeW, aOpacity_); return; }
  aPreview = aBuildAnnot(aTool_, aStartX, aStartY, pos.x, pos.y); aRedraw(); if (aPreview) aDrawAnnot(aPreview);
});
aC?.addEventListener('pointerup', e => {
  if (!aDrawing) return; aDrawing = false; const pos = aGetPos(e);
  if (aTool_ === 'pen') { if (aCurrentPath.length > 1) aPush({ type: 'pen', color: aColor_, width: aStrokeW, opacity: aOpacity_, points: [...aCurrentPath] }); aCurrentPath = []; }
  else if (aTool_ !== 'eraser' && aTool_ !== 'text') { const a = aBuildAnnot(aTool_, aStartX, aStartY, pos.x, pos.y); if (a) aPush(a); aPreview = null; }
  aRedraw();
});
aC?.addEventListener('pointercancel', () => { aDrawing = false; aCurrentPath = []; aPreview = null; aRedraw(); });

function aBuildAnnot(t, x1, y1, x2, y2) {
  if (t === 'arrow') return { type: 'arrow', color: aColor_, width: aStrokeW, opacity: aOpacity_, x1, y1, x2, y2 };
  if (t === 'line') return { type: 'line', color: aColor_, width: aStrokeW, opacity: aOpacity_, x1, y1, x2, y2 };
  if (t === 'circle') return { type: 'circle', color: aColor_, width: aStrokeW, opacity: aOpacity_, cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, rx: Math.abs(x2 - x1) / 2, ry: Math.abs(y2 - y1) / 2 };
  if (t === 'rect') return { type: 'rect', color: aColor_, width: aStrokeW, opacity: aOpacity_, x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1) };
  return null;
}
function aEraseAt(x, y) {
  const r = aStrokeW * 4 + 15;
  const before = aAnnotations.length;
  aAnnotations = aAnnotations.filter(a => {
    let cx, cy;
    if (a.type === 'pen') return !a.points.some(p => Math.hypot(p.x - x, p.y - y) < r);
    if (a.type === 'circle') { cx = a.cx; cy = a.cy; }
    else if (a.type === 'arrow' || a.type === 'line') { cx = (a.x1 + a.x2) / 2; cy = (a.y1 + a.y2) / 2; }
    else if (a.type === 'rect') { cx = a.x + a.w / 2; cy = a.y + a.h / 2; }
    else if (a.type === 'text') { cx = a.x; cy = a.y; }
    else return true;
    return Math.hypot(cx - x, cy - y) >= r + 30;
  });
  if (aAnnotations.length !== before) { aUpdateBadge(); aRedraw(); }
}
function aRedraw() {
  if (!aCtx) return;
  aCtx.clearRect(0, 0, aC.width, aC.height);
  aAnnotations.forEach(aDrawAnnot);
  if (aCurrentPath.length > 1) aDrawPath(aCurrentPath, aColor_, aStrokeW, aOpacity_);
  if (aPreview) aDrawAnnot(aPreview);
}
function aDrawAnnot(a) {
  if (!aCtx) return;
  aCtx.save(); aCtx.globalAlpha = a.opacity ?? 1; aCtx.strokeStyle = a.color; aCtx.fillStyle = a.color; aCtx.lineWidth = a.width; aCtx.lineCap = 'round'; aCtx.lineJoin = 'round';
  if (a.type === 'pen') { aDrawPath(a.points, a.color, a.width, a.opacity); aCtx.restore(); return; }
  if (a.type === 'line') { aCtx.beginPath(); aCtx.moveTo(a.x1, a.y1); aCtx.lineTo(a.x2, a.y2); aCtx.stroke(); }
  if (a.type === 'arrow') { const ang = Math.atan2(a.y2 - a.y1, a.x2 - a.x1); const hl = Math.max(14, a.width * 5); aCtx.beginPath(); aCtx.moveTo(a.x1, a.y1); aCtx.lineTo(a.x2, a.y2); aCtx.stroke(); aCtx.beginPath(); aCtx.moveTo(a.x2, a.y2); aCtx.lineTo(a.x2 - hl * Math.cos(ang - 0.4), a.y2 - hl * Math.sin(ang - 0.4)); aCtx.lineTo(a.x2 - hl * Math.cos(ang + 0.4), a.y2 - hl * Math.sin(ang + 0.4)); aCtx.closePath(); aCtx.fill(); }
  if (a.type === 'circle') { aCtx.beginPath(); aCtx.ellipse(a.cx, a.cy, a.rx, a.ry, 0, 0, Math.PI * 2); aCtx.stroke(); }
  if (a.type === 'rect') { aCtx.beginPath(); aCtx.rect(a.x, a.y, a.w, a.h); aCtx.stroke(); }
  if (a.type === 'text') { aCtx.font = `bold ${a.size}px 'Jost',sans-serif`; aCtx.fillStyle = a.color; aCtx.fillText(a.text, a.x, a.y); }
  aCtx.restore();
}
function aDrawPath(pts, c, w, op) {
  if (!aCtx || pts.length < 2) return;
  aCtx.save(); aCtx.globalAlpha = op ?? 1; aCtx.strokeStyle = c; aCtx.lineWidth = w; aCtx.lineCap = 'round'; aCtx.lineJoin = 'round';
  aCtx.beginPath(); aCtx.moveTo(pts[0].x, pts[0].y); pts.forEach(p => aCtx.lineTo(p.x, p.y)); aCtx.stroke(); aCtx.restore();
}
function aSpawnText(x, y) {
  if (aTextInput_) aTextInput_.remove();
  const inp = document.createElement('input');
  inp.style.cssText = `position:absolute;left:${x}px;top:${y - 22}px;background:transparent;border:none;border-bottom:2px solid ${aColor_};color:${aColor_};font-size:22px;font-family:'Jost',sans-serif;font-weight:700;outline:none;min-width:120px;z-index:10;`;
  document.getElementById('analyzerMain').appendChild(inp);
  inp.focus(); aTextInput_ = inp;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === 'Escape') aCommitText(inp, x, y); });
  inp.addEventListener('blur', () => aCommitText(inp, x, y));
}
function aCommitText(inp, x, y) {
  const val = inp.value.trim();
  if (val) aPush({ type: 'text', color: aColor_, opacity: aOpacity_, size: 22, text: val, x, y: y + 4 });
  inp.remove(); aTextInput_ = null; aRedraw();
}
function aPush(a) { aAnnotations.push(a); aUpdateBadge(); }
function aUndo() { if (aAnnotations.length) { aAnnotations.pop(); aUpdateBadge(); aRedraw(); } }
function aClearAll() { aAnnotations = []; aUpdateBadge(); aRedraw(); }
function aUpdateBadge() { const b = document.getElementById('aAnnotBadge'); if (!b) return; const n = aAnnotations.length; b.textContent = n; n ? b.classList.add('show') : b.classList.remove('show'); }

// Analyzer video controls
const aVid = document.getElementById('analyzerVideo');
if (aVid) {
  aVid.addEventListener('timeupdate', () => {
    if (!aVid.duration) return;
    document.getElementById('analyzerSeek').value = (aVid.currentTime / aVid.duration) * 100;
    document.getElementById('analyzerTime').textContent = fmt(aVid.currentTime) + ' / ' + fmt(aVid.duration);
  });
  aVid.addEventListener('ended', () => document.getElementById('analyzerPlayBtn').textContent = '▶');
  aVid.addEventListener('pause', () => document.getElementById('analyzerPlayBtn').textContent = '▶');
  aVid.addEventListener('play', () => document.getElementById('analyzerPlayBtn').textContent = '⏸');
}
document.getElementById('analyzerSeek')?.addEventListener('input', e => { if (aVid?.duration) aVid.currentTime = (e.target.value / 100) * aVid.duration; });
function aTogglePlay() { if (aVid) aVid.paused ? aVid.play() : aVid.pause(); }
function aStep(dir) { if (!aVid) return; aVid.pause(); aVid.currentTime = Math.max(0, Math.min(aVid.duration || 0, aVid.currentTime + dir / 30)); }
function aCycleSpeed() { aSpeedIdx = (aSpeedIdx + 1) % aSpeeds.length; if (aVid) aVid.playbackRate = aSpeeds[aSpeedIdx]; document.getElementById('speedBtn').textContent = aSpeeds[aSpeedIdx] + '×'; }

// ── TIMESTAMPS (Analyzer) ──
function openTsPopup() {
  if (!aVid) return;
  aVid.pause();
  tsPendingTime = aVid.currentTime || 0;
  document.getElementById('tsPopupTime').textContent = fmt(tsPendingTime);
  document.getElementById('tsNoteInput').value = '';
  document.getElementById('tsPopup').classList.add('show');
  setTimeout(() => document.getElementById('tsNoteInput').focus(), 80);
}
function closeTsPopup() { document.getElementById('tsPopup').classList.remove('show'); }

async function saveTsNote() {
  const note = document.getElementById('tsNoteInput').value.trim();
  if (!note) { document.getElementById('tsNoteInput').focus(); return; }
  const { data, error } = await db.from('timestamps').insert({ clip_id: analyzerClipId, time_seconds: tsPendingTime, note }).select().single();
  if (error) { toast('Error saving timestamp: ' + error.message, 'error'); return; }
  allTimestamps.push(data);
  closeTsPopup();
  if (tsPanelOpen) renderAnalyzerTsList();
  toast('Timestamp saved at ' + fmt(tsPendingTime), 'success');
}

function toggleTsPanel() {
  tsPanelOpen = !tsPanelOpen;
  document.getElementById('analyzerTsPanel')?.classList.toggle('show', tsPanelOpen);
  document.getElementById('toggleTsPanelBtn').style.color = tsPanelOpen ? 'var(--gold)' : 'rgba(253,246,236,0.6)';
  if (tsPanelOpen) renderAnalyzerTsList();
}

function renderAnalyzerTsList() {
  const list = document.getElementById('atsList');
  const badge = document.getElementById('atsBadge');
  if (!list) return;
  const ts = allTimestamps.filter(t => t.clip_id === analyzerClipId).sort((a, b) => a.time_seconds - b.time_seconds);
  if (badge) badge.textContent = ts.length || '';
  list.innerHTML = '';
  if (!ts.length) { list.innerHTML = '<div style="padding:16px;text-align:center;color:rgba(253,246,236,0.3);font-size:12px">No timestamps yet.<br>Hit 📍 to add one.</div>'; return; }
  ts.forEach(t => {
    const item = document.createElement('div');
    item.className = 'ats-item';
    item.innerHTML = `
      <div class="ats-item-top">
        <span class="ats-item-time" onclick="aJumpTo(${t.time_seconds})">${fmt(t.time_seconds)}</span>
        <span class="ats-item-note">${t.note}</span>
      </div>
      <input class="ats-edit-input" type="text" value="${t.note}" placeholder="Edit note…">
      <div class="ats-item-actions">
        <button class="ats-action-btn edit" onclick="startEditTs('${t.id}',this)">✏️ Edit</button>
        <button class="ats-action-btn del" onclick="deleteAnalyzerTs('${t.id}')">✕ Delete</button>
      </div>`;
    list.appendChild(item);
  });
}

function aJumpTo(time) { if (aVid) { aVid.pause(); aVid.currentTime = time; } }

function startEditTs(id, btn) {
  const item = btn.closest('.ats-item');
  const noteEl = item.querySelector('.ats-item-note');
  const inp = item.querySelector('.ats-edit-input');
  const isEditing = inp.classList.contains('show');
  if (isEditing) {
    const newNote = inp.value.trim();
    if (newNote) {
      db.from('timestamps').update({ note: newNote }).eq('id', id).then(() => {
        const t = allTimestamps.find(x => x.id === id);
        if (t) t.note = newNote;
        noteEl.textContent = newNote;
      });
    }
    inp.classList.remove('show'); btn.textContent = '✏️ Edit';
  } else {
    inp.classList.add('show'); inp.focus(); inp.select(); btn.textContent = '💾 Save';
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') startEditTs(id, btn); if (e.key === 'Escape') { inp.classList.remove('show'); btn.textContent = '✏️ Edit'; } }, { once: true });
  }
}

async function deleteAnalyzerTs(id) {
  await db.from('timestamps').delete().eq('id', id);
  allTimestamps = allTimestamps.filter(t => t.id !== id);
  renderAnalyzerTsList();
  toast('Timestamp deleted', 'info');
}

// ── SNAPSHOT ──
async function aSaveSnapshot() {
  const vid = document.getElementById('analyzerVideo');
  const canvas = document.getElementById('analyzerCanvas');
  const tmp = document.createElement('canvas');
  tmp.width = vid.videoWidth || canvas.width;
  tmp.height = vid.videoHeight || canvas.height;
  const tc = tmp.getContext('2d');
  tc.drawImage(vid, 0, 0, tmp.width, tmp.height);
  const sx = tmp.width / canvas.width, sy = tmp.height / canvas.height;
  tc.save(); tc.scale(sx, sy);
  aAnnotations.forEach(a => {
    tc.save(); tc.globalAlpha = a.opacity ?? 1; tc.strokeStyle = a.color; tc.fillStyle = a.color; tc.lineWidth = a.width; tc.lineCap = 'round'; tc.lineJoin = 'round';
    if (a.type === 'pen') { tc.beginPath(); tc.moveTo(a.points[0].x, a.points[0].y); a.points.forEach(p => tc.lineTo(p.x, p.y)); tc.stroke(); }
    else if (a.type === 'line') { tc.beginPath(); tc.moveTo(a.x1, a.y1); tc.lineTo(a.x2, a.y2); tc.stroke(); }
    else if (a.type === 'arrow') { const ang = Math.atan2(a.y2 - a.y1, a.x2 - a.x1); const hl = Math.max(14, a.width * 5); tc.beginPath(); tc.moveTo(a.x1, a.y1); tc.lineTo(a.x2, a.y2); tc.stroke(); tc.beginPath(); tc.moveTo(a.x2, a.y2); tc.lineTo(a.x2 - hl * Math.cos(ang - 0.4), a.y2 - hl * Math.sin(ang - 0.4)); tc.lineTo(a.x2 - hl * Math.cos(ang + 0.4), a.y2 - hl * Math.sin(ang + 0.4)); tc.closePath(); tc.fill(); }
    else if (a.type === 'circle') { tc.beginPath(); tc.ellipse(a.cx, a.cy, a.rx, a.ry, 0, 0, Math.PI * 2); tc.stroke(); }
    else if (a.type === 'rect') { tc.beginPath(); tc.rect(a.x, a.y, a.w, a.h); tc.stroke(); }
    else if (a.type === 'text') { tc.font = `bold ${a.size}px 'Jost',sans-serif`; tc.fillText(a.text, a.x, a.y); }
    tc.restore();
  });
  tc.restore();

  tmp.toBlob(async (blob) => {
    const path = `${analyzerClipId}/${Date.now()}.png`;
    const { error: upErr } = await db.storage.from(SNAPSHOT_BUCKET).upload(path, blob);
    if (upErr) { toast('Snapshot upload failed', 'error'); return; }
    const { data: { publicUrl } } = db.storage.from(SNAPSHOT_BUCKET).getPublicUrl(path);
    const { data: snap } = await db.from('snapshots').insert({ clip_id: analyzerClipId, image_url: publicUrl, storage_path: path }).select().single();
    if (snap) allSnapshots.push(snap);
    toast('Snapshot saved!', 'success');
  }, 'image/png');
}

async function deleteSnapshot(snapId, clipId) {
  const snap = allSnapshots.find(s => s.id === snapId);
  if (snap?.storage_path) await db.storage.from(SNAPSHOT_BUCKET).remove([snap.storage_path]);
  await db.from('snapshots').delete().eq('id', snapId);
  allSnapshots = allSnapshots.filter(s => s.id !== snapId);
  const snaps = allSnapshots.filter(s => s.clip_id === clipId);
  const sec = document.getElementById('snapshotsSection');
  if (snaps.length) renderSnapshots(snaps, clipId, true);
  else if (sec) sec.style.display = 'none';
}

// ── KEYBOARD ──
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (document.getElementById('analyzerScreen')?.classList.contains('active')) {
    if (e.key === ' ') { e.preventDefault(); aTogglePlay(); }
    if (e.key === 'ArrowRight') aStep(1);
    if (e.key === 'ArrowLeft') aStep(-1);
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') aUndo();
    const map = { p: 'pen', a: 'arrow', c: 'circle', r: 'rect', t: 'text', e: 'eraser' };
    if (map[e.key]) aTool(map[e.key]);
    if (e.key === 'Escape') closeAnalyzer();
  }
});
document.getElementById('tsNoteInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') saveTsNote();
  if (e.key === 'Escape') closeTsPopup();
});
