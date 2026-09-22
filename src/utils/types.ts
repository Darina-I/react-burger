export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TSelectBurger = {
  ingredients: TIngredient[];
  buns?: TIngredient;
};

export type Order = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

export type OrderIngredient = {
  ingredients: string[];
  _id: string;
  name: string;
  status: string;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type Orders = {
  orders: OrderIngredient[];
  success: boolean;
  total: number;
  totalToday: number;
};

export type BurgerItem = {
  nanoid: string;
} & TIngredient;

export type TUser = {
  name: string;
  email: string;
};

export type TMessage = {
  message: string;
  token: string;
};

export type TSocketMessage = {
  message: string;
  success: boolean;
  username: string;
  id?: string;
  isBot?: boolean;
};

export type TUserSocket = {
  id: string;
  token: string;
  success: boolean;
  username: string;
};
