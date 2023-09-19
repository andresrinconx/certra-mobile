export const formatText = (text: string) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const getDate = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${String(month).length === 1 ? `0${month}` : `${month}`}-${String(day).length === 1 ? `0${day}` : `${day}`}`
}

export const getHour = (date: Date) => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${hours}:${minutes}:${seconds}`
}

export function getMonthAndDays(date: Date) {
  const data = [
    { month: 'Enero      ', days: 31 },
    { month: 'Febrero    ', days: 29 },
    { month: 'Marzo      ', days: 31 },
    { month: 'Abril      ', days: 30 },
    { month: 'Mayo       ', days: 31 },
    { month: 'Junio      ', days: 30 },
    { month: 'Julio      ', days: 31 },
    { month: 'Augosto    ', days: 31 },
    { month: 'Septiembre ', days: 30 },
    { month: 'Octubre    ', days: 31 },
    { month: 'Noviembre  ', days: 30 },
    { month: 'Diciembre  ', days: 31 },
  ]
  
  return data[date.getMonth()] // object {month: string, days: number}
}