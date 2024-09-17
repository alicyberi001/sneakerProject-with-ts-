type UrlsType = {
  auth: {
    login: string;
    signup: string;
  };
  user: string;
  sneaker: string;
  brands: string;
  item: (id: number) => string;
};

export const urls: UrlsType = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
  },
  user: "/user",
  sneaker: "/sneaker",
  brands: "/sneaker/brands",
  item: (id: number) => `/sneaker/item/${id}`,
};
