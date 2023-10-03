export interface MyUserInterface {
  from: string
  clipro?: string
  cliente?: string
  cedula?: string
  image_url?: URL
  nombre?: string
  us_nombre?: string
  us_codigo?: string
  customer?: {
    cliente: number
    nombre: string
  }
  deposito?: string
}