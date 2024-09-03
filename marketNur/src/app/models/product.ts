export interface ProductImage {
    url: string;
    id: number;
    product_id: number;
    extension: string;
    createdAt: string;
    updatedAt: string;
  }
  
export interface Product {
  titulo: any;
  descripcion: any;
  precio: any;
  categoria: any;
  estado: any;
images: string [];
    title: any;
    id: number;
    name: string;
    description: string;
    price: number;
    latitude: string;
    longitude: string;
    category_id: number;
    status: number;
    sold: number;
    user_id: number;
    createdAt: string;
    updatedAt: string;
    productimages: ProductImage[];
    category: {
      toLowerCase(): unknown;
      id: number;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
  }