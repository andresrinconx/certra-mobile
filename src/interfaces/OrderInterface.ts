import { ProductoOrderInterface } from "./ProductoOrderInterface";

export interface OrderInterface {
  subtotal: string,
  total: string,
  cliente: {name: string, code: number},
  productos: ProductoOrderInterface[],
}