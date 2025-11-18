export type FooterResponseProps = {
  _id: number;
  institution: string;
  location: string;
  email: string;
  phone: string;
  copyrightText: string;
  laboratoryName: string;
  createdAt: Date;
  updatedAt: Date;
  logos: [
    {
      _id: string;
      altText: string;
      urlLogo: string;
      file: {
        _id: string;
        platform: string;
        imageName: string;
        size: number;
        key: string;
        url: string;
        altText: string;
        createdAt: string;
        updateAt: string;
      };
    }
  ];
};

export type FooterRequestProps = {
  institution: string;
  location: string;
  email: string;
  phone: string;
  laboratoryName: string;
  copyrightText: string;
  file: File;
};
