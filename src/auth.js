const USERS_KEY = 'users';
const SESSION_KEY = 'session';

export const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'password123',
};

const DEMO_USER = {
  id: 'demo-user',
  name: 'Demo User',
  email: DEMO_CREDENTIALS.email,
  passwordHash: btoa(DEMO_CREDENTIALS.password),
};

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureDemoUser() {
  const users = readUsers();
  if (!users.some((u) => u.email.toLowerCase() === DEMO_USER.email)) {
    writeUsers([...users, DEMO_USER]);
  }
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email };
}

export function register({ name, email, password }) {
  ensureDemoUser();
  const users = readUsers();
  const normalized = email.toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === normalized)) {
    return { error: 'An account with this email already exists' };
  }
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim(),
    passwordHash: btoa(password),
  };
  writeUsers([...users, user]);
  return { ok: true, user: publicUser(user) };
}

export function login(email, password) {
  ensureDemoUser();
  const users = readUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user || user.passwordHash !== btoa(password)) {
    return { error: 'Invalid email or password' };
  }
  const session = publicUser(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, user: session };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function resetPassword(email, newPassword) {
  const users = readUsers();
  const idx = users.findIndex(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (idx === -1) return { error: 'No account found for that email' };
  users[idx] = { ...users[idx], passwordHash: btoa(newPassword) };
  writeUsers(users);
  return { ok: true };
}

export function emailExists(email) {
  ensureDemoUser();
  return readUsers().some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
