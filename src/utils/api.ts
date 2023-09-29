import axios from 'axios'
import { LOCAL_API_URL, API_URL } from '@env'
import { OrderInterface } from '../interfaces/OrderInterface'

const apiBaseUrl = LOCAL_API_URL

// -----------------------------------------------
// ENDPOINTS
// -----------------------------------------------

// Login & Products
const tableDataEndpoint = (table: string) => `${apiBaseUrl}/${table}`
const searchOneItemEndpoint = (table: string, code: string) => `${apiBaseUrl}/${table}/${code}`
const searchedItemsEndpoint = (params: { searchTerm: string, table: string }) => `${apiBaseUrl}/${params.table}/${params.searchTerm}`
const sendDataEndpoint = () => `${apiBaseUrl}/pedidoguardar`

// Profile
const userDataEndpoint = (params: { code: string, table: string }) => `${apiBaseUrl}/${params.table}/${params.code}`

// Itinerary
const itineraryEndpoint = (params: { salesperson: string, year: string, month: string }) => `${apiBaseUrl}/itinerarioP2/${params.salesperson}/${params.year}/${params.month}`
const itineraryItemEndpoint = () => `${apiBaseUrl}/itinerarioDetalle2`
const reasonsEndpoint = () => `${apiBaseUrl}/motivo`

// Order Record
const lastItemsScliEndpoint = (customer: string) => `${apiBaseUrl}/historialPediC/${customer}`
const lastItemsLabEndpoint = (params: { clipro: string, code: string }) => `${apiBaseUrl}/historialPedi/${params.clipro}/${params.code}`

// -----------------------------------------------
// API CALL
// -----------------------------------------------

const apiCall = async (endpoint: string, method: Uppercase<string>, data?: any)=>{
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

// Login & Products
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

// Profile
export const fetchUserData = async (params: { code: string, table: string }) => {
  return apiCall(userDataEndpoint(params), 'GET')
}

// Itinerary
export const fetchItinerary = async (params: { salesperson: string, year: string, month: string }) => {
  return apiCall(itineraryEndpoint(params), 'GET')
}
export const fetchItineraryItem = (data: { numero: string, coordenadas: string, observacion: string, motivo: string, fecha: string }) => {
  return apiCall(itineraryItemEndpoint(), 'PUT', data)
}
export const fetchReasons = () => {
  return apiCall(reasonsEndpoint(), 'GET')
}

// Order Record
export const fetchLastItemsScli = (customer: string) => {
  return apiCall(lastItemsScliEndpoint(customer), 'GET')
}
export const fetchLastItemsLab = (params: { clipro: string, code: string }) => {
  return apiCall(lastItemsLabEndpoint(params), 'GET')
}