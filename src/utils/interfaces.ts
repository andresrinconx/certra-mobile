// -----------------------------------------------
// USERS
// -----------------------------------------------

export interface MyUserInterface {
  access: {
    customerAccess: boolean
    labAccess: boolean
    salespersonAccess: boolean
  }
  clipro?: string
  cliente?: string
  cedula?: string
  image_url?: URL | string
  nombre?: string
  us_nombre?: string
  us_codigo?: string
  vendedor?: string
  customer?: {
    cliente: string
    nombre: string
  }
  deposito?: string
}

export interface DataConfigProfileInterface {
  nombre?: string
  apellido?: string
  cliente?: string
  proveed?: string
  rifci?: string
  rif?: string
  cedula?: string
  email?: string
  emailc?: string
  telefono?: string
  aniversario?: string
  nacimi?: string
  dire11?: string
  direc1?: string
  us_nombre?: string
  telefon2?: string
  contacto?: string
}

export interface UserFromScliInterface {
  cliente: string
  nombre: string
  clave: string
  rifci: string
  deposito: string
}

// -----------------------------------------------
// PRODUCTS
// -----------------------------------------------

export interface ProductOrderInterface {
  codigo: string
  descrip: string
  base1: number
  precio1: number
  iva: number
  cantidad: number
}

export interface OrderInterface {
  date: string
  hora: string
  cliente: {
    name: string 
    code: string
    usuario?: string
  }
  productos: ProductOrderInterface[]
  subtotal: string
  total: string
}

export interface OrderRecordItemInterface {
  cod_cli: string
  numero: string
  nombre: string
  fecha: string
  subTotal: string
  iva: string
  importe: string
  unidades: string
  usuario: string
}

export interface ProductCartInterface {
  codigo: string
  amount: number
  labDiscount:string
  productDiscount: string
  customerDiscount: string
}

export interface ProductInterface {
  descrip: string
  precio1: number
  id: number
  amount: number
  image_url: URL | string
  codigo: string
  merida?: number
  centro?: number
  oriente?: number
  base1: number
  iva?: number
  origenn?: string
  labDiscount?: string
  productDiscount?: string
  customerDiscount?: string
  escala1?: string
  pescala1?: string
  escala2?: string
  pescala2?: string
  escala3?: string
  pescala3?: string
}

// -----------------------------------------------
// OTHER
// -----------------------------------------------

export interface ItineraryEventInterface {
  cliente: string
  direccion: string
  telefono: string
  numero: string
  motivo: string
  descrip: string
  fecha: string
}

export interface ThemeColorsInterface {
  primary: string
  background: string
  charge: string
  list: string
  lightList: string
  turquoise: string
  darkTurquoise: string
  green: string
  blue: string
  icon: string
  typography: string
  processBtn: string
}