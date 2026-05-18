import type { Article } from '../../backend/src/types/article';

const res = await fetch(`http://127.0.0.1:3000/api/articles/latest`, {
  method: 'GET',
  credentials: 'include'
});

if (!res.ok) throw new Error('No article found');

const articleData = (await res.json()) as Article;

if (!articleData) throw new Error('No data was sent');

const articleBody = document.getElementById('index-article-body') as HTMLElement;
const articleTitle = document.getElementById('index-article-title') as HTMLElement;

if (!articleBody) throw new Error('The article body was not found');

articleBody.innerHTML = '';

const imgPath = `./assets/images/articles/${articleData.img_url}`;

articleTitle.innerHTML = articleData.title;
articleBody.innerHTML = articleData.content;
