import { setAccessToken } from './shared.js';

const signupForm = document.getElementById('signup-form');
//throw new Error('Login form not found');

if (!(signupForm instanceof HTMLFormElement)) throw new Error('Sign up form not found');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(signupForm);
  const { firstName, lastName, username, email, password } = Object.fromEntries(formData);

  const res = await fetch('http://127.0.0.1:3000/api/user/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // credentials: 'include',
    body: JSON.stringify({ firstName, lastName, username, email, password })
  });

  if (!res.ok) {
    console.log('Sign up failed');
    return;
  }

  const loginRes = await fetch('http://127.0.0.1:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });

  if (!loginRes.ok) {
    console.log('kunde inte logga in efter sign up');
    return;
  }

  const data = await loginRes.json();
  // spara access token i localstorage typ
  const { accessToken } = data;
  setAccessToken(accessToken);
  // navigate to index.html Windiw.location kanske
  window.location.href = 'http://127.0.0.1:5500/public/profile.html';
});
