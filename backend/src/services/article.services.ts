import type {
  ArticleCreate,
  SearchParamsArticle,
  ArticleSearchRow,
} from '../types/article';
import { db } from '../databases/mysql/connection';

export const showLatestArticle = async () => {
  const [rows] = await db.query<ArticleSearchRow[]>(`SELECT a.*,
    authors.name AS author_name FROM articles a
    LEFT JOIN authors ON a.author_id = authors.id
    ORDER BY published_date DESC
    LIMIT 1;`);

  return rows[0];
};

export const searchArticles = async (params: SearchParamsArticle) => {
  const {
    author,
    title,
    slug,
    category,
    tag,
    plant,
    sort = 'created_at',
    order = 'desc',
  } = params;

  const filters: string[] = [];
  const values: any[] = [];

  if (author) {
    filters.push('(au.name LIKE ?)');
    values.push(`%${author}%`);
  }

  if (title) {
    filters.push('a.title LIKE ?');
    values.push(`%${title}%`);
  }

  if (slug) {
    filters.push('a.slug LIKE ?');
    values.push(`%${slug}%`);
  }

  if (category) {
    filters.push('c.name = ?');
    values.push(category);
  }

  if (tag) {
    filters.push('t.name LIKE ?');
    values.push(`%${tag}%`);
  }

  if (plant) {
    filters.push('p.name LIKE ?');
    values.push(`%${plant}%`);
  }

  let query = `SELECT a.*,
  au.name AS author_name,
  c.name AS category_name
  FROM articles a
  LEFT JOIN authors au ON a.author_id = au.id
  LEFT JOIN categories c ON a.category_id = c.id
  LEFT JOIN article_tags at ON at.article_id = a.id
  LEFT JOIN tags t ON t.id = at.tag_id
  LEFT JOIN article_plants ap ON ap.article_id = a.id
  LEFT JOIN plants p ON p.id = ap.plant_id`;

  if (filters.length > 0) {
    query += ` WHERE ${filters.join(' AND ')}`;
  }

  query += ` GROUP BY a.id`;

  const allowedSort = ['title', 'created_at'];
  const allowedOrder = ['asc', 'desc'];

  const sortField = allowedSort.includes(sort) ? sort : 'created_at';
  const sortOrder = allowedOrder.includes(order) ? order : 'desc';

  query += ` ORDER BY a.${sortField} ${sortOrder}`;

  const [rows] = await db.query<ArticleSearchRow[]>(query, values);

  return rows;
};

export const getAllArticles = async () => {
  const [rows] =
    await db.query(`SELECT a.*, authors.name AS author_name, categories.name AS category_name FROM articles a
    LEFT JOIN authors ON a.author_id = authors.id
    LEFT JOIN categories ON a.category_id = categories.id`);

  return rows;
};

export const getArticleById = async (id: number) => {
  const [rows] = await db.query(
    `SELECT a.*, authors.name AS author_name, categories.name AS category_name FROM articles a
  LEFT JOIN authors ON a.author_id = authors.id
  LEFT JOIN categories ON a.category_id = categories.id
  WHERE a.id = ?`,
    [id],
  );

  return (rows as any)[0];
};

export const getArticlesById = async (ids: [number]) => {
  const [rows] = await db.query(`SELECT * FROM articles WHERE id IN (?)`, [
    ids,
  ]);

  return rows;
};

export const getArticleBySlug = async (slug: string) => {
  const [rows] = await db.query<ArticleSearchRow[]>(
    `SELECT a.*, authors.name AS author_name, categories.name AS category_name FROM articles a
  LEFT JOIN authors ON a.author_id = authors.id
  LEFT JOIN categories ON a.category_id = categories.id
  WHERE a.slug = ?`,
    [slug],
  );

  return rows[0];
};

export const createArticle = async (article: ArticleCreate) => {
  const {
    author_id,
    title,
    slug,
    img_url,
    content,
    excerpt,
    category_id,
    is_premium,
    tags,
    plants,
  } = article;

  const [result]: any = await db.query(
    `INSERT INTO articles
    (author_id, title, slug, img_url, content, excerpt, category_id, published_date, created_at, updated_at, is_premium)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW(), ?)`,
    [
      author_id,
      title,
      slug,
      img_url,
      content,
      excerpt,
      category_id,
      is_premium ?? false,
    ],
  );

  const articleId = result.insertId;

  if (tags?.length) {
    const tagValues = tags.map((tagId) => [articleId, tagId]);
    await db.query(`INSERT INTO article_tags (article_id, tag_id) VALUES ?`, [
      tagValues,
    ]);
  }

  if (plants?.length) {
    const plantValues = plants.map((plantId) => [articleId, plantId]);
    await db.query(
      `INSERT INTO article_plants (article_id, plant_id) VALUES ?`,
      [plantValues],
    );
  }

  return articleId;
};

export const updateArticle = async (id: number, article: ArticleCreate) => {
  const {
    author_id,
    title,
    slug,
    img_url,
    content,
    excerpt,
    category_id,
    is_premium,
    tags,
    plants,
  } = article;

  await db.query(
    `UPDATE articles
    SET author_id=?, title=?, slug=?, img_url=?, content=?, excerpt=?, category_id=?, updated_at=NOW(), is_premium=?
    WHERE id=?`,
    [
      author_id,
      title,
      slug,
      img_url,
      content,
      excerpt,
      category_id,
      is_premium,
      id,
    ],
  );

  if (tags !== undefined) {
    await db.query(`DELETE FROM article_tags WHERE article_id=?`, [id]);

    const tagValues = tags.map((tagId) => [id, tagId]);
    await db.query(`INSERT INTO article_tags (article_id, tag_id) VALUES ?`, [
      tagValues,
    ]);
  }

  if (plants !== undefined) {
    await db.query(`DELETE FROM article_plants WHERE article_id=?`, [id]);

    const plantValues = plants.map((plantId) => [id, plantId]);
    await db.query(
      `INSERT INTO article_plants (article_id, plant_id) VALUES ?`,
      [plantValues],
    );
  }

  return true;
};

export const deleteArticle = async (id: number) => {
  await db.query(`DELETE FROM articles WHERE id=?`, [id]);
};
