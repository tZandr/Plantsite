import type { Article } from '../../backend/src/types/article';

const res = await fetch("http://127.0.0.1:3000/api/articles/", {
  method: "GET",
  credentials: "include",
});

if (!res.ok) throw new Error("Could not find the articles");
const articleData = await res.json();

if (!articleData) throw new Error("Something is wrong with the articles");

const articleContainer = document.querySelector(
  ".articles-container",
) as HTMLDivElement;

articleContainer.innerHTML = "";

articleData.forEach((article: Article) => {
  const newArticle = document.createElement("div");
  newArticle.className = "small-article";

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
  newArticle
    .querySelector(".btn-article")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();
      articleContainer.append(newArticle);

      window.location.href = `http://127.0.0.1:5500/public/article.html?id=${article.id}`;
    });
  articleContainer.append(newArticle);
  console.log(article.title);
});
