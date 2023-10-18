import { ProductInterface, ScalesInterface } from './interfaces'

// -----------------------------------------------
// DATE HELPERS
// -----------------------------------------------

export const formatText = (text: string) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const getDate = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${String(month).length === 1 ? `0${month}` : `${month}`}-${String(day).length === 1 ? `0${day}` : `${day}`}`
}

export const getDateWithoutHyphen = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}${String(month).length === 1 ? `0${month}` : `${month}`}${String(day).length === 1 ? `0${day}` : `${day}`}`
}
 
export const getHour = (date: Date) => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${String(hours).length === 1 ? `0${hours}` : `${hours}`}:${String(minutes).length === 1 ? `0${minutes}` : `${minutes}`}`
}

export const getDayOfWeekInText = (date: Date) => {
  const daysOfWeek = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ]
  return daysOfWeek[date.getDay()]
}

const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

export const getMonthAndDays = (date: Date) => {
  const data = [
    { month: 'Enero      ', days: 31 },
    { month: 'Febrero    ', days: isLeapYear(date.getFullYear()) ? 29 : 28 },
    { month: 'Marzo      ', days: 31 },
    { month: 'Abril      ', days: 30 },
    { month: 'Mayo       ', days: 31 },
    { month: 'Junio      ', days: 30 },
    { month: 'Julio      ', days: 31 },
    { month: 'Agosto    ', days: 31 },
    { month: 'Septiembre ', days: 30 },
    { month: 'Octubre    ', days: 31 },
    { month: 'Noviembre  ', days: 30 },
    { month: 'Diciembre  ', days: 31 },
  ]

  return data[date.getMonth()] // object {month: string, days: number}
}

export const valitadeDateInRange = (initialDate: Date, finalDate: Date) => {
  const date = new Date()

  if (initialDate < date && finalDate > date) {
    return true
  } else {
    return false
  }
}

export const getMonthInText = (date: string) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ]

  const month = months[Number(date.substring(5, 7))-1]
  return month
}

export const longDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }
  const formatedDate = new Date(date).toLocaleDateString('es-ES', options)
  return formatedDate
}

// -----------------------------------------------
// CALCS HELPERS
// -----------------------------------------------

export const currency = (price: number | string, currency?: '$' | '€') => {
  return `${currency ?? 'Bs.'} ${Number(price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Calcula el porcentaje de descuento (pescala1, pescala2, pescala3)
 */
export const calculatePercentProductDiscount = (amount: number, scales: { escala1: string, escala2: string, escala3: string, pescala1: string, pescala2: string, pescala3: string }) => {
  let productDiscount = 0

  if (amount >= Number(scales.escala1) && amount < Number(scales.escala2)) {
    productDiscount = Number(scales.pescala1)

  } else if (amount >= Number(scales.escala2) && amount < Number(scales.escala3)) {
    productDiscount = Number(scales.pescala2)

  } else if (amount >= Number(scales.escala3)) {
    productDiscount = Number(scales.pescala3)
  }
  return productDiscount
}

/**
 * Calcula el total de descuento en Bs de cada producto del carrito (toma en cuenta la unidad), 
 * la suma de todos da el total de descuentos que es lo que se muestra antes del IVA
 */
export const calculateDiscountsPrice = (product: ProductInterface) => {
  const { fdesde, fhasta, labDiscount, amount, base1, escala1, escala2, escala3, pescala1, pescala2, pescala3, customerDiscount } = product

  // Lab
  const labDiscountPriceBs = (Number(labDiscount) * base1) / 100

  // Product
  let productDiscountPriceBs = 0
  if (valitadeDateInRange(new Date(`${fdesde}`), new Date(`${fhasta}`))) {
    productDiscountPriceBs = (calculatePercentProductDiscount(amount, { escala1, escala2, escala3, pescala1, pescala2, pescala3 } as ScalesInterface) 
      * (base1 - labDiscountPriceBs)) / 100
  }
  
  // Customer
  const customerDiscountPriceBs = (Number(customerDiscount) * ((base1 - labDiscountPriceBs) - productDiscountPriceBs)) / 100

  return labDiscountPriceBs + productDiscountPriceBs + customerDiscountPriceBs
}

/**
 * Calcula el IVA en Bs de cada producto (toma en cuenta la unidad)
 * y la suma de todas las IVAs da el IVA que se muestra antes del total
 */
export const calculateIvaPrice = (product: ProductInterface) => {
  const { iva, base1 } = product

  const priceWithDiscounts = (base1 - calculateDiscountsPrice(product))

  return (Number(iva) * (priceWithDiscounts)) / 100
}

/**
 * Calcula el subtotal, descuentos, IVA y total de la orden
 */
export const calculateProccessOrderData = (fullProductsCart: ProductInterface[]) => {
  const subtotal = fullProductsCart.reduce((accumulator: number, product: ProductInterface) => accumulator + (product.base1 * product.amount), 0)
  const discount = fullProductsCart.reduce((accumulator: number, product: ProductInterface) => accumulator + (product.amount * calculateDiscountsPrice(product)), 0)
  const iva = fullProductsCart.reduce((accumulator: number, product: ProductInterface) => accumulator + (product.amount * calculateIvaPrice(product)), 0)
  const total = (subtotal - discount) + iva

  return {
    subtotal,
    discount,
    iva,
    total
  }
}