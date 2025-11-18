export type BannerProps = {
  data: Array<BannerResponseProps>;
  fallback: boolean;
};

export type BannerResponseProps = {
  _id: string;
  title: string;
  altText: string;
  published: boolean;
  link: string;
  desktopImage: {
    key: string;
    size: number;
    url: string;
    imageName: string;
  };
  mobileImage: {
    key: string;
    size: number;
    url: string;
    imageName: string;
  };
  createdAt: Date;
  updateAt: Date;
};

export type BannerRequestProps = {
  title: string;
  altText: string;
  published: boolean;
  link: string;
  desktopImage: File;
  mobileImage: File;
};
