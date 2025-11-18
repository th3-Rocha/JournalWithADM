export type NewsProps = {
  data: Array<NewsResponseProps>;
  fallback: boolean;
};

export type NewsRequestProps = {
  title: string;
  altText: string;
  published: boolean;
  post: boolean;
  groupId: string;
  metaDescription: string;
  author: string;
  desktopImage: File;
};

export type NewsResponseProps = {
  _id: string;
  title: string;
  author: string;
  altText: string;
  text: string;
  metaDescription: string;
  published: boolean;
  post: boolean;
  groupId: string;
  fileName: string;
  key: string;
  size: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};
