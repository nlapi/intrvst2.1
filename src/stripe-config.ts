export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price?: number;
}

export const products: Product[] = [
  {
    id: 'prod_SenkSGBMNl20WT',
    priceId: 'price_1RjU8vKK3t54Z5JeFZy8yBCJ',
    name: 'InterviewSignal',
    description: 'Your AI partner for interview success.',
    mode: 'subscription',
    price: 20.00
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};