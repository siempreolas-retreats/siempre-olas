// ── SUPABASE CONFIG ──
const SUPABASE_URL = 'https://lrqgsiulejzsagvvfydf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycWdzaXVsZWp6c2FndnZmeWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjQ1MTksImV4cCI6MjA5MjQwMDUxOX0.CIkJ-tvviW0tUqW3xyO9BjKmJ6JHD4ytdasE_7IZPj0';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const VIDEO_BUCKET = 'videos';
const SNAPSHOT_BUCKET = 'snapshots';
const RESEND_API_KEY = 're_YjDQr57s_418Up5wrLEXRqtDJAtyUMZwA';

async function sendInviteEmail(toEmail, surferName, loginUrl) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'Siempre Olas <onboarding@resend.dev>',
      to: toEmail,
      subject: `${surferName}, your Siempre Olas session is ready 🏄`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <img src="https://i.ibb.co/W4jggH5Z/Untitled-design-16.png" style="height:60px;margin-bottom:24px;">
          <h2 style="color:#2c2416">Hey ${surferName}!</h2>
          <p style="color:#8a7a66;line-height:1.7">Your surf session analysis is ready. Click below to set up your account and view your clips, coach notes and timestamps.</p>
          <a href="${loginUrl}" style="display:inline-block;margin:24px 0;background:#e8927a;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600;">View My Sessions</a>
          <p style="color:#8a7a66;font-size:13px">If the button doesn't work, go to: ${loginUrl}</p>
        </div>`
    })
  });
}
