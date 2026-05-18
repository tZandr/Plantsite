export function setAccessToken(token: string | null) {
  if (!token) {
    console.log('The access token you tried to set is invalid');
    return;
  }

  localStorage.setItem('token', token);
}

export function getAccessToken() {
  return localStorage.getItem('token');
}
export const fetchWithAuth = async (
  url: string,
  options: RequestInit,
  accessToken: string | null
): Promise<Response> => {
  // gör orginal fetch och testa accessToken
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${accessToken}`
    }
  });

  // finns det ingen accessToken testa göra en refresh
  if (res.status === 401) {
    // testar hämta en ny accessToken
    const refreshRes = await fetch('http://127.0.0.1:3000/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });

    // om refreshToken finns så sätt den nya accessToken i localstorage
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setAccessToken(data.accessToken);

      // gör om orginal fetchen fast nu med tillåtelse
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${data.accessToken}`
        }
      });
    } else {
      setAccessToken(null);
    }
  }

  return res;
};
