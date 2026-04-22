// ── AUTH ──

async function getSession() {
  const { data: { session } } = await db.auth.getSession();
  return session;
}

async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  // Fetch profile for role
  const { data } = await db
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  return data;
}

async function signIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  await db.auth.signOut();
  window.location.reload();
}

// Coach creates a surfer account
async function createSurferAccount(name, email, password) {
  // Use admin-style signup — surfer gets a welcome email automatically
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: 'surfer' }
    }
  });
  if (error) throw error;

  // Insert profile row
  const { error: profileError } = await db
    .from('profiles')
    .insert({ id: data.user.id, name, email, role: 'surfer' });
  if (profileError) throw profileError;

  return data.user;
}
