import { ProductoOrderInterface } from "./ProductoOrderInterface";

export interface OrderInterface {
  date: string,
  hora: string,
  cliente: {
    name: string, 
    code: number
  },
  productos: ProductoOrderInterface[],
  subtotal: string,
  total: string,
}