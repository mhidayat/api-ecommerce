export interface RawProduct {
    id: number;
    title: string;
    sku: string;
    images: string[];
    price: number;
    stock: number;
    description: string;
}

export interface Product {
  id: number;
  title: string;
  sku: string;
  image: string;
  price: number;
  stock: number;
  description: string;
}

export interface UpdateProductBody {
    sku: string;
    title?: string;
    image?: string;
    price?: number;
    stock?: number;
    description?: string;
}

export interface Transaction {
    id: number;
    sku: string;
    qty: number;
    amount: number;
  }

export interface CreateProductBody {
    sku: string;
    title: string;
    image: string;
    price: number;
    stock: number;
    description?: string;
}

export interface CreateTransactionBody {
    sku: string;
    qty: number;
}

export interface UpdateTransactionBody {
    id: number;
    sku: string;
    qty: number;
}

export const emptyProduct = (): Product => ({
    id: 0,
    title: '',
    sku: "",
    image: "",
    price: 0,
    stock: 0,
    description: ""
}) 