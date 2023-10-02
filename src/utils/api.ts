import axios from 'axios'
import { LOCAL_API_URL, API_URL } from '@env'
import { OrderInterface } from '../interfaces/OrderInterface'

const apiBaseUrl = LOCAL_API_URL

// -----------------------------------------------
// ENDPOINTS
// -----------------------------------------------

// LOGIN & PRODUCTS
const tableDataEndpoint = (table: string) => `${apiBaseUrl}/${table}`
const searchOneItemEndpoint = (table: string, code: string) => `${apiBaseUrl}/${table}/${code}`
const searchedItemsEndpoint = (params: { searchTerm: string, table: string }) => `${apiBaseUrl}/${params.table}/${params.searchTerm}`
const sendDataEndpoint = () => `${apiBaseUrl}/pedidoguardar`

// PROFILE
const userDataEndpoint = (params: { code: string, table: string }) => `${apiBaseUrl}/${params.table}/${params.code}`

// ITINERARY
const itineraryEndpoint = (params: { salesperson: string, year: string, month: string }) => `${apiBaseUrl}/itinerarioP2/${params.salesperson}/${params.year}/${params.month}`
const itineraryItemEndpoint = () => `${apiBaseUrl}/itinerarioDetalle2`
const reasonsEndpoint = () => `${apiBaseUrl}/motivo`

// ORDER RECORD
// pharmacy
const lastItemsScliEndpoint = (customer: string) => `${apiBaseUrl}/historialPediC/${customer}`
const rangeScliEndpoint = () => `${apiBaseUrl}/historialRang/1638/20230901/20230914`

// lab
const lastItemsLabEndpoint = (params: { clipro: string, code: string }) => `${apiBaseUrl}/historialPedi/${params.clipro}/${params.code}`
const lastItemsLabScliEndpoint = (params: { code: string, customer: string }) => `${apiBaseUrl}/historialPediFarmacia/${params.code}/${params.customer}`
const rangeLabEndpoint = () => `${apiBaseUrl}/historial10/5383/DISTRILABCA/20230901/20230914`

// sales
const lastItemsSalespersonEndpoint = (salesperson: string) => `${apiBaseUrl}/pedidoUsuario/${salesperson}`
const lastItemsSalespersonScliEndpoint = (params: { code: string, customer: string }) => `${apiBaseUrl}/pedidoUsuarioCli/${params.code}/${params.customer}`
const rangeSalespersonEndpoint = () => `${apiBaseUrl}/historial10/5383/DISTRILABCA/20230901/20230914`

// -----------------------------------------------
// API CALL
// -----------------------------------------------

const apiCall = async (endpoint: string, method: Uppercase<string>, data?: unknown) => {
  try {
    const response = await axios.request({
      method,
      url: endpoint,
      data: data ? data : { }
    })
    return response.data
  } catch(error) {
    console.log(error)
    // throw new Error(error)
  }
}

// -----------------------------------------------
// FUNCTIONS
// -----------------------------------------------

// LOGIN & PRODUCTS
export const fetchTableData = (table: string) => {
  return apiCall(tableDataEndpoint(table), 'GET')
}
export const fetchOneItem = (table: string, code: string) => {
  return apiCall(searchOneItemEndpoint(table, code), 'GET')
}
export const fetchSearchedItems = async (params: { searchTerm: string, table: string }) => {
  return apiCall(searchedItemsEndpoint(params), 'GET')
}
export const fetchSendData = async (order: OrderInterface) => {
  return apiCall(sendDataEndpoint(), 'POST', order)
}

// PROFILE
export const fetchUserData = async (params: { code: string, table: string }) => {
  return apiCall(userDataEndpoint(params), 'GET')
}

// ITINERARY
export const fetchItinerary = async (params: { salesperson: string, year: string, month: string }) => {
  return apiCall(itineraryEndpoint(params), 'GET')
}
export const fetchItineraryItem = (data: { numero: string, coordenadas: string, observacion: string, motivo: string, fecha: string }) => {
  return apiCall(itineraryItemEndpoint(), 'PUT', data)
}
export const fetchReasons = () => {
  return apiCall(reasonsEndpoint(), 'GET')
}

// ORDER RECORD

// pharmacy
export const fetchLastItemsScli = (customer: string) => {
  return apiCall(lastItemsScliEndpoint(customer), 'GET')
}

// lab
export const fetchLastItemsLab = (params: { clipro: string, code: string }) => {
  return apiCall(lastItemsLabEndpoint(params), 'GET')
}
export const fetchLastItemsLabScli = (params: { code: string, customer: string }) => {
  return apiCall(lastItemsLabScliEndpoint(params), 'GET')
}

// sales
export const fetchLastItemsSalesperson = (salesperson: string) => {
  return apiCall(lastItemsSalespersonEndpoint(salesperson), 'GET')
}
export const fetchLastItemsSalespersonScli = (params: { code: string, customer: string }) => {
  return apiCall(lastItemsSalespersonScliEndpoint(params), 'GET')
}