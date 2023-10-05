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
  const DAYS_OF_WEEK = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ]
  return DAYS_OF_WEEK[date.getDay()]
}

export function getMonthAndDays(date: Date) {
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

  function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }
  
  return data[date.getMonth()] // object {month: string, days: number}
}