/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  category: string;
  subcategory: string;
  brand: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  colors: string[];
  sizes?: string[];
  specs: Record<string, string>;
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  flashSaleDiscount?: number;
  viewsCount: number;
  sku: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  likes: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  couponCode?: string;
  shippingAddress: {
    fullName: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  trackingCode: string;
}

export interface User {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  avatar?: string;
  cashbackBalance: number;
  savedAddresses: Array<{
    id: string;
    fullName: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }>;
  savedCards: Array<{
    id: string;
    brand: 'visa' | 'mastercard' | 'elo';
    lastFour: string;
    holderName: string;
    expiry: string;
  }>;
}

export interface Coupon {
  code: string;
  discountValue: number;
  type: 'percentage' | 'fixed';
  minPurchase: number;
  description: string;
}
