import { ProductoOrderInterface } from './ProductoOrderInterface' 

export interface OrderInterface {
  date: string,
  hora: string,
  cliente: {
    name: string, 
    code: number
    usuario?: string
  },
  productos: ProductoOrderInterface[],
  subtotal: string,
  total: string,
}