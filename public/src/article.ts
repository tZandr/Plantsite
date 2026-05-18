import { fetchWithAuth, getAccessToken } from './shared.js';
import type { Article } from '../../backend/src/types/article';

const id = new URLSearchParams(window.location.search).get('id');
const res = await fetch(`http://127.0.0.1:3000/api/articles/get/${id}`, {
  method: 'GET',
  credentials: 'include'
});

if (!res.ok) throw new Error('No article found');

const articleData = (await res.json()) as Article;

if (!articleData) throw new Error('No data was sent');

// console.log(articleData);

const articleBody = document.getElementById('article-body') as HTMLElement;

if (!articleBody) throw new Error('The article body was not found');

articleBody.innerHTML = '';

const imgPath = `./assets/images/articles/${articleData.img_url}`;

const newArticle = document.createElement('div');
newArticle.className = 'article-page';

newArticle.innerHTML = `

  <h2>${articleData.title}
  <label for="save">save
    <button class="saved-btn">
        <svg id="svgelem" width="20" height="20" viewBox="70 20 160 160" xmlns="http://www.w3.org/2000/svg">
          <polygon id="star" points="150,20 170,80 230,80 185,120 205,180 150,150 95,180 115,120 70,80 130,80"
               fill="#ffffff"
               stroke="#000000"
               stroke-width="2"/>
          </svg>
    </button>
  </label>
  </h2>
  <h4>${articleData.excerpt}</h4>
  <h5> Written by: ${articleData.author_name}</h5>
  <div class="article-hero-wrapper">
    <img class="article-hero" src="${imgPath}">
  </div>
  <p class="article-text">${articleData.content}</p>
`;

newArticle.querySelector('.saved-btn')?.addEventListener('click', async (e) => {
  e.preventDefault();

  const res = await fetchWithAuth(
    'http://127.0.0.1:3000/api/user/save-article',
    {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ articleId: articleData.id })
    },
    getAccessToken()
  );

  if (!res.ok) throw new Error('something went wrong, try again.');

  const data = await res.json();

  const star = document.getElementById('star') as unknown as SVGPolygonElement;
  star.setAttribute('fill', '#FFD800');
  star.setAttribute('stroke', '#00000000');

  console.log(data);
});

articleBody.append(newArticle);

const returnBtn = document.getElementById('return') as HTMLAnchorElement;
const prevUrl = document.referrer;
returnBtn.href = prevUrl;
