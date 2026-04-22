@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

:root {
  --cream:    #fdf6ec;
  --sand:     #f5e6cc;
  --gold:     #e8c882;
  --warm:     #f0d9a8;
  --wave-blue:#a8c4d4;
  --teal:     #7ab8b8;
  --coral:    #e8927a;
  --peach:    #f4b49a;
  --sage:     #8aaa88;
  --bark:     #8b6b4a;
  --ink:      #2c2416;
  --muted:    #8a7a66;
  --edge:     rgba(139,107,74,0.15);
  --panel:    #fef9f1;
  --sans:     'Jost', sans-serif;
  --serif:    'Playfair Display', serif;
  --mono:     'DM Mono', monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; width: 100%; background: var(--cream); color: var(--ink); font-family: var(--sans); overflow: hidden; }

/* ── SCREENS ── */
.screen { display: none; height: 100vh; width: 100vw; flex-direction: column; overflow: hidden; }
.screen.active { display: flex; }

/* ── BUTTONS ── */
.btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: 50px; border: none;
  font-family: var(--sans); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.btn-primary { background: var(--coral); color: white; }
.btn-primary:hover { background: #d97d64; }
.btn-ghost { background: transparent; color: var(--ink); border: 1.5px solid var(--edge); }
.btn-ghost:hover { background: var(--sand); }
.btn-danger { background: rgba(232,146,122,0.12); color: var(--coral); border: 1px solid rgba(232,146,122,0.3); }
.btn-danger:hover { background: rgba(232,146,122,0.22); }
.btn-sm { padding: 6px 14px; font-size: 12px; }

/* ── NAV SHARED ── */
.logo-wrap { display: flex; align-items: center; gap: 12px; }
.logo-img { height: 52px; width: auto; display: block; }
.logo-subtitle { font-family: var(--serif); font-style: italic; font-size: 11px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }
.spacer { flex: 1; }

/* ── LOGIN SCREEN ── */
#loginScreen {
  background: var(--cream);
  align-items: center; justify-content: center;
}
#loginScreen::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 70% 40% at 50% 110%, rgba(168,196,212,0.25) 0%, transparent 70%),
    radial-gradient(ellipse 50% 30% at 90% 10%, rgba(232,200,130,0.2) 0%, transparent 60%);
  pointer-events: none;
}
.login-box {
  background: white; border: 1px solid var(--edge); border-radius: 24px;
  padding: 40px 44px; width: 400px; max-width: 95vw;
  box-shadow: 0 8px 40px rgba(44,36,22,0.1);
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; gap: 24px;
}
.login-box .login-logo { height: 70px; }
.login-box h2 { font-family: var(--serif); font-size: 22px; color: var(--ink); text-align: center; }
.login-box .login-sub { font-size: 13px; color: var(--muted); text-align: center; margin-top: -16px; }
.login-form { width: 100%; display: flex; flex-direction: column; gap: 12px; }
.form-field { display: flex; flex-direction: column; gap: 5px; }
.form-field label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
.form-field input {
  background: var(--cream); border: 1px solid var(--edge); border-radius: 10px;
  padding: 11px 14px; color: var(--ink); font-family: var(--sans); font-size: 14px;
  outline: none; transition: border-color 0.15s; width: 100%;
}
.form-field input:focus { border-color: var(--coral); }
.login-error { color: var(--coral); font-size: 12px; text-align: center; min-height: 18px; }
.login-btn { width: 100%; justify-content: center; padding: 12px; font-size: 14px; }

/* ── COACH HOME ── */
#coachHome { background: var(--cream); }
#coachHome::before {
  content: ''; position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 70% 40% at 50% 110%, rgba(168,196,212,0.2) 0%, transparent 70%),
    radial-gradient(ellipse 50% 30% at 90% 10%, rgba(232,200,130,0.15) 0%, transparent 60%);
  pointer-events: none;
}
#coachNav {
  display: flex; align-items: center; gap: 14px; padding: 12px 28px;
  border-bottom: 1px solid var(--edge); flex-shrink: 0;
  background: rgba(253,246,236,0.92); backdrop-filter: blur(8px);
  position: relative; z-index: 1;
}
.nav-user { font-size: 12px; color: var(--muted); }
.nav-user strong { color: var(--ink); font-weight: 500; }

/* Upload strip */
#uploadStrip {
  display: flex; align-items: center; gap: 12px; padding: 10px 28px;
  background: var(--warm); border-bottom: 1px solid var(--edge);
  flex-shrink: 0; position: relative; z-index: 1; flex-wrap: wrap;
}
.strip-label { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--bark); white-space: nowrap; }
#bulkDropZone {
  flex: 1; min-width: 200px;
  border: 1.5px dashed rgba(139,107,74,0.3); border-radius: 50px; padding: 8px 18px;
  display: flex; align-items: center; gap: 10px; cursor: pointer;
  transition: all 0.2s; font-size: 13px; color: var(--muted);
  background: rgba(255,255,255,0.5);
}
#bulkDropZone:hover, #bulkDropZone.drag-over { border-color: var(--coral); background: rgba(232,146,122,0.08); color: var(--ink); }
#bulkFileInput { display: none; }
#unassignedTray { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tray-label { font-size: 11px; color: var(--muted); white-space: nowrap; }
#unassignedCount { background: var(--coral); color: white; font-size: 10px; font-weight: 700; border-radius: 10px; padding: 1px 7px; min-width: 20px; text-align: center; display: none; }
#unassignedCount.show { display: inline-block; }
#clipTray { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; max-width: 50vw; }
#clipTray::-webkit-scrollbar { height: 3px; }
#clipTray::-webkit-scrollbar-thumb { background: var(--edge); border-radius: 2px; }
.clip-chip {
  display: flex; align-items: center; gap: 6px; background: white; border: 1px solid var(--edge);
  border-radius: 50px; padding: 5px 12px; font-size: 11px; font-family: var(--mono);
  white-space: nowrap; cursor: grab; transition: all 0.15s; flex-shrink: 0; color: var(--ink);
}
.clip-chip:hover { border-color: var(--coral); background: rgba(232,146,122,0.06); }
.clip-chip.dragging { opacity: 0.4; }
.chip-del { margin-left: 4px; opacity: 0.4; cursor: pointer; font-size: 13px; color: var(--coral); }
.chip-del:hover { opacity: 1; }

/* Upload progress overlay */
#uploadProgressOverlay {
  position: fixed; inset: 0; background: rgba(44,36,22,0.5);
  display: none; align-items: center; justify-content: center; z-index: 2000;
  backdrop-filter: blur(4px);
}
#uploadProgressOverlay.show { display: flex; }
.upload-progress-box {
  background: white; border-radius: 20px; padding: 32px 40px;
  display: flex; flex-direction: column; gap: 16px; align-items: center;
  min-width: 300px; box-shadow: 0 20px 60px rgba(44,36,22,0.2);
}
.upload-progress-box h3 { font-family: var(--serif); font-size: 20px; }
.upload-progress-bar-wrap { width: 100%; height: 6px; background: var(--cream); border-radius: 3px; overflow: hidden; }
.upload-progress-bar { height: 100%; background: var(--coral); border-radius: 3px; transition: width 0.3s; width: 0%; }
.upload-progress-text { font-size: 12px; color: var(--muted); font-family: var(--mono); }

/* Home content */
#homeContent { flex: 1; overflow-y: auto; padding: 24px 28px; position: relative; z-index: 1; }
#homeContent::-webkit-scrollbar { width: 5px; }
#homeContent::-webkit-scrollbar-thumb { background: var(--edge); border-radius: 3px; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.section-header h2 { font-family: var(--serif); font-size: 18px; font-style: italic; color: var(--muted); }
.section-header h2 span { color: var(--ink); font-style: normal; }

#surferGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 14px; }
.add-surfer-card {
  border: 1.5px dashed rgba(139,107,74,0.2); border-radius: 18px; padding: 28px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  cursor: pointer; transition: all 0.2s; min-height: 150px;
  color: var(--muted); font-size: 13px; background: rgba(255,255,255,0.4);
}
.add-surfer-card:hover { border-color: var(--coral); background: rgba(232,146,122,0.05); color: var(--ink); }
.add-surfer-card .plus { font-size: 26px; color: var(--coral); line-height: 1; }

.surfer-card {
  background: white; border: 1px solid var(--edge); border-radius: 18px;
  overflow: hidden; transition: all 0.2s; cursor: pointer; position: relative; min-height: 150px;
  box-shadow: 0 2px 12px rgba(44,36,22,0.06);
}
.surfer-card:hover { border-color: rgba(232,146,122,0.5); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(44,36,22,0.1); }
.surfer-card.drop-target { border-color: var(--coral); background: rgba(232,146,122,0.06); box-shadow: 0 0 0 3px rgba(232,146,122,0.2); }
.card-drop-hint {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(232,146,122,0.1); font-size: 13px; color: var(--coral); font-weight: 600;
  opacity: 0; pointer-events: none; transition: opacity 0.15s; border-radius: 18px;
}
.surfer-card.drop-target .card-drop-hint { opacity: 1; }
.card-header { padding: 16px 18px 10px; display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.surfer-avatar {
  width: 42px; height: 42px; border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), var(--peach));
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-size: 18px; color: var(--bark); flex-shrink: 0;
}
.surfer-info { flex: 1; }
.surfer-name { font-family: var(--serif); font-size: 20px; color: var(--ink); line-height: 1.2; }
.surfer-meta { font-size: 11px; color: var(--muted); margin-top: 3px; }
.card-clips { padding: 0 18px 14px; display: flex; gap: 5px; flex-wrap: wrap; }
.card-clip-thumb {
  background: var(--cream); border: 1px solid var(--edge); border-radius: 50px;
  font-size: 10px; font-family: var(--mono); padding: 3px 9px;
  color: var(--muted); display: flex; align-items: center; gap: 4px;
}
.card-clip-thumb .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--teal); }
.card-actions { display: flex; gap: 5px; }
.card-icon-btn {
  background: var(--cream); border: 1px solid var(--edge); color: var(--muted);
  border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center;
  justify-content: center; cursor: pointer; font-size: 11px; transition: all 0.15s;
}
.card-icon-btn:hover { background: var(--sand); color: var(--ink); }
.card-icon-btn.del:hover { background: rgba(232,146,122,0.15); color: var(--coral); border-color: rgba(232,146,122,0.3); }

/* ── PROFILE SCREEN (shared coach + surfer) ── */
#profileScreen { background: var(--cream); }
#profileNav {
  display: flex; align-items: center; gap: 14px; padding: 10px 22px;
  border-bottom: 1px solid var(--edge); flex-shrink: 0;
  background: rgba(253,246,236,0.95); backdrop-filter: blur(8px);
}
.back-btn {
  background: var(--cream); border: 1px solid var(--edge); color: var(--muted);
  cursor: pointer; font-size: 16px; padding: 6px 10px; transition: all 0.15s;
  border-radius: 50px; display: flex; align-items: center; font-family: var(--sans);
}
.back-btn:hover { color: var(--ink); border-color: var(--coral); }
#profileAvatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), var(--peach));
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-size: 16px; color: var(--bark); flex-shrink: 0;
}
#profileName { font-family: var(--serif); font-size: 20px; color: var(--ink); }
#profileClipCount { font-size: 11px; color: var(--muted); }
#profileBody { flex: 1; display: flex; overflow: hidden; }

/* Sidebar */
#clipsSidebar {
  width: 260px; flex-shrink: 0; background: var(--panel);
  border-right: 1px solid var(--edge); display: flex; flex-direction: column; overflow: hidden;
}
.sidebar-header {
  padding: 12px 14px; border-bottom: 1px solid var(--edge);
  font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
  color: var(--muted); display: flex; align-items: center; justify-content: space-between;
}
.day-group-header {
  font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  color: var(--bark); padding: 10px 12px 5px;
  border-bottom: 1px solid var(--edge); margin-bottom: 4px; margin-top: 6px;
  display: flex; align-items: center; gap: 6px;
}
.day-group-header::before { content: ''; width: 3px; height: 3px; border-radius: 50%; background: var(--coral); flex-shrink: 0; }
.day-group-header:first-child { margin-top: 0; }
#clipsList { flex: 1; overflow-y: auto; padding: 8px; }
#clipsList::-webkit-scrollbar { width: 4px; }
#clipsList::-webkit-scrollbar-thumb { background: var(--edge); border-radius: 2px; }
.clip-item {
  border-radius: 10px; padding: 10px 12px; cursor: pointer;
  transition: all 0.15s; border: 1px solid transparent;
  display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px;
}
.clip-item:hover { background: var(--cream); }
.clip-item.active { background: rgba(232,146,122,0.1); border-color: rgba(232,146,122,0.3); }
.clip-name { font-size: 11px; font-family: var(--mono); color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.clip-actions-row { display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap; }
.clip-action-btn {
  font-size: 10px; padding: 2px 8px; border-radius: 50px;
  border: 1px solid var(--edge); background: white; color: var(--muted); cursor: pointer; transition: all 0.15s;
}
.clip-action-btn:hover { background: var(--cream); color: var(--ink); }
.clip-action-btn.analyze { border-color: rgba(122,184,184,0.4); color: var(--teal); }
.clip-action-btn.analyze:hover { background: rgba(122,184,184,0.1); }
.clip-action-btn.compare { border-color: rgba(232,146,122,0.4); color: var(--coral); }
.clip-action-btn.compare:hover { background: rgba(232,146,122,0.1); }

/* Profile main */
#profileMain { flex: 1; overflow-y: auto; padding: 24px; }
#profileMain::-webkit-scrollbar { width: 5px; }
#profileMain::-webkit-scrollbar-thumb { background: var(--edge); border-radius: 3px; }

.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; gap: 12px; color: var(--muted); text-align: center;
}
.empty-state .big-icon { font-size: 44px; opacity: 0.4; }
.empty-state h3 { font-family: var(--serif); font-style: italic; font-size: 20px; color: var(--muted); }
.empty-state p { font-size: 12px; max-width: 240px; line-height: 1.7; }

/* Custom video player */
#profileVideoWrap {
  background: #1a1209; border-radius: 14px; overflow: hidden;
  width: 100%; max-width: 820px; margin: 0 auto 18px; position: relative;
}
#profileVideoWrap video { width: 100%; display: block; border-radius: 14px 14px 0 0; }
#profilePlayerControls {
  background: rgba(26,18,9,0.97); border-radius: 0 0 14px 14px;
  padding: 8px 14px 10px; display: none; flex-direction: column; gap: 6px;
}
#profileVideoWrap.loaded #profilePlayerControls { display: flex; }
#profileSeekWrap {
  position: relative; height: 18px; display: flex; align-items: center; cursor: pointer;
}
#profileSeekBg {
  position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%);
  height: 4px; background: rgba(253,246,236,0.15); border-radius: 2px; pointer-events: none;
}
#profileSeekFill {
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  height: 4px; background: var(--coral); border-radius: 2px; pointer-events: none; width: 0%;
}
#profileSeekThumb {
  position: absolute; top: 50%; transform: translate(-50%,-50%);
  width: 13px; height: 13px; border-radius: 50%; background: var(--gold);
  pointer-events: none; left: 0%; box-shadow: 0 1px 4px rgba(0,0,0,0.4);
}
.seek-ts-dot {
  position: absolute; top: 50%; transform: translate(-50%,-50%);
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--coral); border: 2px solid rgba(253,246,236,0.9);
  pointer-events: all; cursor: pointer; z-index: 4; transition: transform 0.12s;
}
.seek-ts-dot:hover { transform: translate(-50%,-50%) scale(1.5); }
.seek-ts-dot .seek-ts-tooltip {
  position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
  background: rgba(26,18,9,0.95); color: var(--cream); border: 1px solid rgba(232,146,122,0.4);
  border-radius: 8px; padding: 6px 10px; white-space: nowrap;
  font-family: var(--sans); font-size: 11px; pointer-events: none;
  opacity: 0; transition: opacity 0.15s; box-shadow: 0 4px 14px rgba(0,0,0,0.3);
}
.seek-ts-dot .seek-ts-tooltip .tt-time { font-family: var(--mono); color: var(--coral); font-size: 10px; display: block; margin-bottom: 2px; }
.seek-ts-dot:hover .seek-ts-tooltip { opacity: 1; }
#profilePlayerRow { display: flex; align-items: center; gap: 10px; }
.p-ctrl-btn {
  background: none; border: none; color: rgba(253,246,236,0.7);
  cursor: pointer; font-size: 14px; padding: 2px 4px; transition: color 0.15s; display: flex; align-items: center;
}
.p-ctrl-btn:hover { color: var(--cream); }
#profileTimeDisplay { font-family: var(--mono); font-size: 10px; color: rgba(253,246,236,0.4); white-space: nowrap; flex: 1; }
#profileSpeedBtn {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(139,107,74,0.25);
  color: rgba(253,246,236,0.6); border-radius: 50px; padding: 2px 9px;
  font-family: var(--mono); font-size: 10px; cursor: pointer; transition: all 0.15s;
}
#profileSpeedBtn:hover { background: rgba(255,255,255,0.12); color: var(--cream); }

/* Timestamp overlay on profile video */
#tsOverlay {
  position: absolute; bottom: 64px; left: 50%; transform: translateX(-50%);
  background: rgba(26,18,9,0.92); border: 1px solid rgba(232,146,122,0.5);
  border-radius: 12px; padding: 10px 18px;
  display: flex; align-items: center; gap: 10px;
  pointer-events: none; opacity: 0; transition: opacity 0.3s; z-index: 10;
  max-width: 90%; white-space: nowrap; box-shadow: 0 4px 20px rgba(0,0,0,0.4); color: var(--cream);
}
#tsOverlay.visible { opacity: 1; }
.ts-overlay-time { font-family: var(--mono); font-size: 11px; color: var(--coral); background: rgba(232,146,122,0.15); border-radius: 50px; padding: 2px 8px; flex-shrink: 0; }
.ts-overlay-note { font-family: var(--sans); font-size: 13px; color: var(--cream); font-weight: 500; }

/* Notes + snapshots */
.notes-area { max-width: 820px; margin: 0 auto; }
.notes-area label { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 7px; }
.notes-area textarea {
  width: 100%; background: white; border: 1px solid var(--edge); border-radius: 10px;
  padding: 12px 14px; color: var(--ink); font-family: var(--sans); font-size: 13px;
  line-height: 1.7; resize: vertical; min-height: 80px; outline: none; transition: border-color 0.15s;
}
.notes-area textarea:focus { border-color: var(--coral); }
.snapshots-section { max-width: 820px; margin: 18px auto 0; }
.snapshots-section h4 { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
.snapshots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; }
.snapshot-thumb { border-radius: 8px; overflow: hidden; aspect-ratio: 16/9; background: var(--cream); border: 1px solid var(--edge); cursor: pointer; transition: all 0.15s; position: relative; }
.snapshot-thumb img { width: 100%; height: 100%; object-fit: cover; }
.snapshot-thumb:hover { border-color: var(--coral); }
.snap-del { position: absolute; top: 4px; right: 4px; background: rgba(253,246,236,0.9); color: var(--coral); border: none; border-radius: 4px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 10px; opacity: 0; transition: opacity 0.15s; }
.snapshot-thumb:hover .snap-del { opacity: 1; }

/* Compare (shared coach + surfer) */
#compareWrap { display: none; gap: 12px; }
#compareWrap.show { display: flex; }
.compare-slot {
  flex: 1; background: #1a1209; border-radius: 12px; overflow: hidden;
  position: relative; border: 1px solid var(--edge); display: flex; flex-direction: column;
}
.compare-slot video { width: 100%; display: block; flex: 1; min-height: 0; }
.slot-label {
  position: absolute; top: 8px; left: 10px; background: rgba(44,36,22,0.7);
  padding: 2px 8px; border-radius: 50px; font-size: 10px; font-family: var(--mono); color: white; z-index: 3; pointer-events: none;
}
.cmp-ts-overlay {
  position: absolute; bottom: 52px; left: 50%; transform: translateX(-50%);
  background: rgba(26,18,9,0.92); border: 1px solid rgba(232,146,122,0.5);
  border-radius: 10px; padding: 7px 14px; display: flex; align-items: center; gap: 8px;
  pointer-events: none; opacity: 0; transition: opacity 0.3s; z-index: 10;
  max-width: 90%; white-space: nowrap; box-shadow: 0 4px 16px rgba(0,0,0,0.4); color: var(--cream);
}
.cmp-ts-overlay .ts-overlay-time { color: var(--coral); font-family: var(--mono); font-size: 10px; }
.cmp-ts-overlay .ts-overlay-note { color: var(--cream); font-size: 11px; }
.cmp-ts-overlay.visible { opacity: 1; }
.cmp-player-controls { background: rgba(26,18,9,0.97); padding: 6px 10px 8px; display: flex; flex-direction: column; gap: 5px; flex-shrink: 0; }
.cmp-seek-wrap { position: relative; height: 16px; display: flex; align-items: center; cursor: pointer; }
.cmp-seek-bg { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 3px; background: rgba(253,246,236,0.15); border-radius: 2px; pointer-events: none; }
.cmp-seek-fill { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 3px; background: var(--coral); border-radius: 2px; pointer-events: none; width: 0%; }
.cmp-seek-thumb { position: absolute; top: 50%; transform: translate(-50%,-50%); width: 11px; height: 11px; border-radius: 50%; background: var(--gold); pointer-events: none; left: 0%; }
.cmp-seek-wrap .seek-ts-dot { width: 8px; height: 8px; }
.cmp-row { display: flex; align-items: center; gap: 8px; }
.cmp-time { font-family: var(--mono); font-size: 10px; color: rgba(253,246,236,0.4); flex: 1; }
.cmp-speed-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(139,107,74,0.2); color: rgba(253,246,236,0.5); border-radius: 50px; padding: 2px 8px; font-family: var(--mono); font-size: 10px; cursor: pointer; transition: all 0.15s; }
.cmp-speed-btn:hover { background: rgba(255,255,255,0.1); color: var(--cream); }

/* ── ANALYZER SCREEN ── */
#analyzerScreen { background: #1a1209; flex-direction: column; }
#analyzerBody { flex: 1; display: flex; overflow: hidden; }
#analyzerNav {
  display: flex; align-items: center; gap: 8px; padding: 6px 12px;
  background: rgba(44,36,22,0.97); border-bottom: 1px solid rgba(139,107,74,0.2);
  flex-shrink: 0; flex-wrap: wrap;
}
#analyzerNav .back-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(139,107,74,0.2); color: rgba(253,246,236,0.7); border-radius: 50px; font-size: 14px; }
#analyzerNav .back-btn:hover { color: var(--cream); border-color: var(--coral); }
.nav-divider { width: 1px; height: 22px; background: rgba(139,107,74,0.2); flex-shrink: 0; }
.tool-group { display: flex; gap: 3px; align-items: center; padding-right: 8px; border-right: 1px solid rgba(139,107,74,0.2); }
.tool-group:last-child { border-right: none; padding-right: 0; }
.tool-btn {
  background: rgba(255,255,255,0.05); border: 1.5px solid transparent;
  color: rgba(253,246,236,0.75); border-radius: 8px; width: 32px; height: 32px;
  font-size: 14px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s; flex-shrink: 0; touch-action: manipulation; position: relative;
}
.tool-btn:hover { background: rgba(255,255,255,0.1); color: var(--cream); }
.tool-btn.active { background: rgba(232,146,122,0.2); border-color: var(--coral); color: var(--coral); }
.tip {
  position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
  background: rgba(44,36,22,0.95); color: var(--cream); font-size: 10px; padding: 3px 7px;
  border-radius: 4px; white-space: nowrap; pointer-events: none; opacity: 0;
  transition: opacity 0.15s; font-family: var(--sans); z-index: 100;
}
.tool-btn:hover .tip { opacity: 1; }
.color-swatch { width: 20px; height: 20px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.15s, border-color 0.15s; flex-shrink: 0; }
.color-swatch:hover { transform: scale(1.15); }
.color-swatch.active { border-color: white; transform: scale(1.2); }
.slider-wrap { display: flex; align-items: center; gap: 5px; }
.slider-wrap label { font-size: 9px; color: rgba(253,246,236,0.4); white-space: nowrap; font-family: var(--mono); }
input[type=range].thin-slider { -webkit-appearance: none; width: 65px; height: 3px; background: rgba(253,246,236,0.15); border-radius: 2px; outline: none; cursor: pointer; }
input[type=range].thin-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: var(--gold); cursor: pointer; }
#addTsBtn { display: flex; align-items: center; gap: 5px; background: rgba(232,146,122,0.15); border: 1.5px solid rgba(232,146,122,0.4); color: var(--coral); border-radius: 50px; padding: 4px 12px; font-family: var(--sans); font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
#addTsBtn:hover { background: rgba(232,146,122,0.25); }
#toggleTsPanelBtn { background: rgba(255,255,255,0.05); border: 1px solid rgba(139,107,74,0.2); color: rgba(253,246,236,0.6); border-radius: 50px; padding: 4px 12px; font-family: var(--sans); font-size: 11px; cursor: pointer; }
#analyzerMain { flex: 1; position: relative; overflow: hidden; background: #0e0b06; display: flex; align-items: center; justify-content: center; }
#analyzerVideo { position: absolute; max-width: 100%; max-height: 100%; }
#analyzerCanvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; touch-action: none; }
#analyzerControls { display: flex; align-items: center; gap: 9px; padding: 7px 14px; background: rgba(44,36,22,0.97); border-top: 1px solid rgba(139,107,74,0.2); flex-shrink: 0; }
#analyzerPlayBtn { background: var(--coral); color: white; border: none; border-radius: 50%; width: 36px; height: 36px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; flex-shrink: 0; }
#analyzerPlayBtn:hover { background: #d97d64; }
#analyzerSeek { flex: 1; -webkit-appearance: none; height: 4px; background: rgba(253,246,236,0.15); border-radius: 2px; cursor: pointer; outline: none; }
#analyzerSeek::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%; background: var(--gold); cursor: pointer; }
#analyzerTime { font-size: 10px; font-family: var(--mono); color: rgba(253,246,236,0.4); white-space: nowrap; min-width: 88px; text-align: right; }
.frame-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(139,107,74,0.2); color: rgba(253,246,236,0.7); border-radius: 6px; width: 28px; height: 28px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.frame-btn:hover { background: rgba(255,255,255,0.1); color: var(--cream); }
#speedBtn { background: rgba(255,255,255,0.05); border: 1px solid rgba(139,107,74,0.2); color: rgba(253,246,236,0.6); border-radius: 50px; padding: 3px 10px; font-size: 10px; font-family: var(--mono); cursor: pointer; white-space: nowrap; }
.annot-badge { position: absolute; top: -5px; right: -5px; background: var(--coral); color: white; font-size: 8px; border-radius: 50%; width: 14px; height: 14px; display: none; align-items: center; justify-content: center; font-weight: 700; }
.annot-badge.show { display: flex; }

/* Analyzer timestamp panel */
#analyzerTsPanel { width: 260px; flex-shrink: 0; background: rgba(44,36,22,0.97); border-left: 1px solid rgba(139,107,74,0.2); display: none; flex-direction: column; overflow: hidden; }
#analyzerTsPanel.show { display: flex; }
.ats-header { padding: 10px 14px; border-bottom: 1px solid rgba(139,107,74,0.2); font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(253,246,236,0.4); display: flex; align-items: center; justify-content: space-between; }
.ats-header span { color: var(--coral); font-family: var(--mono); }
#atsList { flex: 1; overflow-y: auto; padding: 8px; }
#atsList::-webkit-scrollbar { width: 3px; }
#atsList::-webkit-scrollbar-thumb { background: rgba(139,107,74,0.3); border-radius: 2px; }
.ats-item { border-radius: 8px; padding: 9px 10px; border: 1px solid rgba(139,107,74,0.15); background: rgba(255,255,255,0.03); margin-bottom: 6px; display: flex; flex-direction: column; gap: 5px; }
.ats-item-top { display: flex; align-items: center; gap: 8px; }
.ats-item-time { font-family: var(--mono); font-size: 11px; color: var(--coral); background: rgba(232,146,122,0.12); border-radius: 50px; padding: 2px 8px; flex-shrink: 0; cursor: pointer; border: 1px solid rgba(232,146,122,0.2); }
.ats-item-time:hover { background: rgba(232,146,122,0.22); }
.ats-item-note { font-size: 12px; color: rgba(253,246,236,0.75); flex: 1; line-height: 1.4; word-break: break-word; }
.ats-item-actions { display: flex; gap: 5px; justify-content: flex-end; }
.ats-action-btn { font-size: 10px; padding: 2px 8px; border-radius: 50px; border: 1px solid rgba(139,107,74,0.2); background: rgba(255,255,255,0.04); color: rgba(253,246,236,0.5); cursor: pointer; transition: all 0.15s; font-family: var(--sans); }
.ats-action-btn:hover { background: rgba(255,255,255,0.1); color: var(--cream); }
.ats-action-btn.edit:hover { border-color: rgba(232,200,130,0.4); color: var(--gold); }
.ats-action-btn.del:hover { border-color: rgba(232,146,122,0.4); color: var(--coral); }
.ats-edit-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(232,146,122,0.4); border-radius: 6px; padding: 5px 8px; color: var(--cream); font-family: var(--sans); font-size: 12px; outline: none; display: none; }
.ats-edit-input.show { display: block; }

/* Timestamp popup */
#tsPopup {
  position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
  background: white; border: 1px solid var(--edge); border-radius: 14px;
  padding: 16px 18px; display: none; flex-direction: column; gap: 10px;
  z-index: 500; box-shadow: 0 8px 32px rgba(44,36,22,0.18); width: 340px;
}
#tsPopup.show { display: flex; }
.ts-popup-time { font-family: var(--mono); font-size: 13px; color: var(--coral); font-weight: 500; }
#tsNoteInput { background: var(--cream); border: 1px solid var(--edge); border-radius: 8px; padding: 9px 12px; color: var(--ink); font-family: var(--sans); font-size: 13px; outline: none; width: 100%; transition: border-color 0.15s; }
#tsNoteInput:focus { border-color: var(--coral); }
.ts-popup-row { display: flex; gap: 8px; justify-content: flex-end; }
.ts-save-btn { background: var(--coral); color: white; border: none; border-radius: 50px; padding: 7px 16px; font-family: var(--sans); font-size: 12px; font-weight: 500; cursor: pointer; }
.ts-save-btn:hover { background: #d97d64; }
.ts-cancel-btn { background: transparent; color: var(--muted); border: 1px solid var(--edge); border-radius: 50px; padding: 7px 14px; font-family: var(--sans); font-size: 12px; cursor: pointer; }

/* ── MODAL ── */
#modalOverlay { position: fixed; inset: 0; background: rgba(44,36,22,0.5); display: none; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(6px); }
#modalOverlay.show { display: flex; }
#modal { background: white; border: 1px solid var(--edge); border-radius: 20px; padding: 28px; width: 400px; max-width: 95vw; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 20px 60px rgba(44,36,22,0.2); }
#modal h3 { font-family: var(--serif); font-size: 22px; color: var(--ink); }
#modal input, #modal select { background: var(--cream); border: 1px solid var(--edge); border-radius: 10px; padding: 11px 14px; color: var(--ink); font-family: var(--sans); font-size: 14px; outline: none; transition: border-color 0.15s; width: 100%; }
#modal input:focus, #modal select:focus { border-color: var(--coral); }
.modal-row { display: flex; gap: 10px; justify-content: flex-end; }
.modal-hint { font-size: 12px; color: var(--muted); line-height: 1.6; }

/* ── SURFER HOME ── */
#surferHome { background: var(--cream); }
#surferNav { display: flex; align-items: center; gap: 14px; padding: 12px 28px; border-bottom: 1px solid var(--edge); flex-shrink: 0; background: rgba(253,246,236,0.92); backdrop-filter: blur(8px); }
#surferContent { flex: 1; overflow-y: auto; padding: 32px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.surfer-welcome { text-align: center; }
.surfer-welcome h2 { font-family: var(--serif); font-size: 28px; color: var(--ink); margin-bottom: 6px; }
.surfer-welcome p { font-size: 14px; color: var(--muted); }
.surfer-clips-section { width: 100%; max-width: 860px; }
.surfer-clips-section h3 { font-family: var(--serif); font-size: 18px; font-style: italic; color: var(--muted); margin-bottom: 14px; }
.surfer-day-group { margin-bottom: 20px; }
.surfer-day-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--bark); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.surfer-day-label::before { content: ''; width: 3px; height: 3px; border-radius: 50%; background: var(--coral); }
.surfer-clip-card { background: white; border: 1px solid var(--edge); border-radius: 12px; padding: 14px 18px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.surfer-clip-card:hover { border-color: rgba(232,146,122,0.4); transform: translateX(3px); }
.surfer-clip-card .clip-info { display: flex; align-items: center; gap: 10px; }
.surfer-clip-card .clip-icon { font-size: 18px; }
.surfer-clip-card .clip-title { font-size: 13px; color: var(--ink); font-family: var(--mono); }
.surfer-clip-card .clip-badges { display: flex; gap: 6px; }
.surfer-clip-badge { font-size: 10px; padding: 2px 8px; border-radius: 50px; background: var(--cream); border: 1px solid var(--edge); color: var(--muted); }
.surfer-clip-badge.has-ts { border-color: rgba(232,146,122,0.3); color: var(--coral); background: rgba(232,146,122,0.06); }
.surfer-clip-badge.has-notes { border-color: rgba(122,184,184,0.3); color: var(--teal); background: rgba(122,184,184,0.06); }

/* ── TOAST ── */
#toast { position: fixed; bottom: 24px; right: 24px; background: white; border: 1px solid var(--edge); border-radius: 50px; padding: 10px 18px; font-size: 12px; z-index: 3000; opacity: 0; transform: translateY(6px); transition: all 0.25s; pointer-events: none; max-width: 260px; box-shadow: 0 4px 20px rgba(44,36,22,0.12); color: var(--ink); }
#toast.show { opacity: 1; transform: translateY(0); }
#toast.success { border-color: rgba(122,184,184,0.5); }
#toast.info { border-color: rgba(232,200,130,0.5); }
#toast.error { border-color: rgba(232,146,122,0.5); color: var(--coral); }

/* Loading spinner */
.spinner { width: 36px; height: 36px; border: 3px solid var(--edge); border-top-color: var(--coral); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-screen { display: flex; align-items: center; justify-content: center; height: 100vh; width: 100vw; background: var(--cream); flex-direction: column; gap: 16px; }
.loading-screen p { font-family: var(--serif); font-style: italic; color: var(--muted); font-size: 15px; }
