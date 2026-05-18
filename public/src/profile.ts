import { fetchWithAuth, getAccessToken } from './shared.js';
import type { User } from '../../backend/src/types/user.js';
import type { Article } from '../../backend/src/types/article.js';

// hämta alla element
const profileUserElement = document.querySelector('#profile-user') as HTMLElement;
const usernameElement = profileUserElement.querySelector('h1') as HTMLHeadingElement;
const favArticlesElement = document.getElementById('fav-articles') as HTMLElement;
// const subHeading = document.querySelector('#profile-user h5') as HTMLHeadingElement;
const res = await fetchWithAuth(
  'http://127.0.0.1:3000/api/auth/me',
  {
    method: 'GET',
    credentials: 'include'
  },

  getAccessToken()
);

if (!res.ok) throw new Error('You need to be logged in');
const userData = await res.json();

if (!userData) throw new Error('Something wrong with user');

const { firstName, lastName, email, username, createdAt } = userData.user as User;
usernameElement.textContent = firstName + ' ' + lastName;

const contentList = [email, username, createdAt];
contentList.forEach((e) => {
  const newElement = document.createElement('h5') as HTMLHeadingElement;
  newElement.textContent = e;
  profileUserElement.append(newElement);
});

const favRes = await fetchWithAuth(
  'http://127.0.0.1:3000/api/articles/favorites',
  {
    method: 'GET',
    credentials: 'include'
  },

  getAccessToken()
);

if (!favRes.ok) {
  window.location.href = `http://127.0.0.1:5500/public/login.html`;
}

const favData = await favRes.json();

favData.articles.forEach((article: Article) => {
  const newArticle = document.createElement('div');
  newArticle.className = 'small-article';

  console.log(article.img_url);
  const imgPath = `./assets/images/articles/${article.img_url}`;
  newArticle.innerHTML = `
  <button class="btn-article col" id="${article.id}">
    <img src="${imgPath}">
  </button>
      <div class="articles-preview-text">
      <h2>${article.title}</h2>
      <h4>${article.excerpt}</h4>
      <date> Written by: ${article.author_name}</date>
      <h5>Created at: ${article.created_at}</h5>
    </div>
  `;
  newArticle.querySelector('.btn-article')?.addEventListener('click', async (e) => {
    e.preventDefault();
    favArticlesElement.append(newArticle);

    window.location.href = `http://127.0.0.1:5500/public/article.html?id=${article.id}`;
  });
  favArticlesElement.append(newArticle);
  console.log(article.title);
});
