import { ProductoOrderInterface } from "./ProductoOrderInterface";

export interface OrderInterface {
  subtotal: string,
  total: string,
  cliente: string,
  productos: ProductoOrderInterface[],
}