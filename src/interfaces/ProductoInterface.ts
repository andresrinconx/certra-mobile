export default interface ProductoInterface {
  descrip: string
  precio1: number
  id: number
  cantidad: number
  agregado: boolean
  image_url: URL | string
  codigo: number,
  merida?: number,
  centro?: number,
  oriente?: number,
  base1: number,
  iva?: number,
  origenn?: string,
}