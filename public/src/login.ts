import { setAccessToken } from './shared.js';

const loginForm = document.getElementById('login-form');

if (loginForm instanceof HTMLFormElement) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const { email, password } = Object.fromEntries(formData);

    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      console.log('Login failed');
      return;
    }

    const data = await res.json();
    // spara access token i localstorage typ
    const { accessToken } = data;
    setAccessToken(accessToken);
    console.log('Login successful');
    window.location.href = 'http://127.0.0.1:5500/public/';
  });
}
