export interface DummyUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

export interface DummyProduct {
  id: number;
  title: string;
  price: number;
}

export interface DummyProductResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}