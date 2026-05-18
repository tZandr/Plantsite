import { Schema, model } from "mongoose";

export interface IComment {
  content: string;
  author: string;
}

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true },
);

export interface IPost {
  title: string;
  img_url?: string;
  content: string;
  tags: string[];
  author?: string;
  comments?: IComment[];
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    img_url: { type: String },
    content: { type: String, required: true },
    tags: { type: [String], required: true },
    author: { type: String, required: true },
    comments: [commentSchema],
  },
  { timestamps: true },
);

export const ForumPost = model<IPost>("ForumPost", postSchema);
