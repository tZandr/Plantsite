import type { RowDataPacket } from 'mysql2';

export interface Article {
  id: number;
  title: string;
  slug: string;
  img_url?: string;
  content: string;
  excerpt: string;
  author_id: number;
  author_name: string;
  category_id: number;
  published_date: Date;
  created_at: Date;
  updated_at: Date;
  is_premium: boolean;
}

export interface ArticleCreate extends Article {
  tags?: number[];
  plants?: number[];
}

export interface SearchParamsArticle {
  author?: string;
  title?: string;
  slug?: string;
  category?: string;
  tag?: string;
  plant?: string;
  sort?: 'title' | 'created_at';
  order?: 'asc' | 'desc';
}

export type ArticleSearchRow = RowDataPacket &
  Article & {
    author_name: string | null;
    category_name: string | null;
  };
