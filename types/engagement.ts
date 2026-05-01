export type CommentRecord = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export type LikeSummary = {
  likes: number;
  liked: boolean;
};
