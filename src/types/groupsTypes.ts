export type GroupsProps = {
    data: Array<GroupsResponseProps>;
    fallback: boolean;
  };
  
  export type GroupsResponseProps = {
    _id: string;
    title: string;
    showNavbar: Boolean;
    metaDescription: string;
    published: Boolean;
    postCover: Boolean;
    postDate: Boolean;
    postTitle: Boolean;
    postText: Boolean;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  };
  