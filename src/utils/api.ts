import axios from 'axios'
import { LOCAL_API_URL, API_URL } from '@env'
import { OrderInterface } from '../interfaces/OrderInterface'

// -----------------------------------------------
// ENDPOINTS
// -----------------------------------------------
 
const apiBaseUrl = LOCAL_API_URL
// const apiBaseUrl = API_URL 

// Get
const tableDataEndpoint = (table: string) => `${apiBaseUrl}/${table}`
const searchOneItemEndpoint = (table: string, code: string) => `${apiBaseUrl}/${table}/${code}`
const searchedItemsEndpoint = (params: { searchTerm: string, table: string }) => `${apiBaseUrl}/${params.table}/${params.searchTerm}`
const userDataEndpoint = (params: { code: string, table: string }) => `${apiBaseUrl}/${params.table}/${params.code}`
const itineraryEndpoint = (params: { salesperson: string, year: string, month: string }) => `${apiBaseUrl}/itinerarioP2/${params.salesperson}/${params.year}/${params.month}`
const lastItemsEndpoint = () => `${apiBaseUrl}/historialPedi/9822/aless`
const reasonsEndpoint = () => `${apiBaseUrl}/motivo`

// Post
const sendDataEndpoint = () => `${apiBaseUrl}/pedidoguardar`

// Put
const itineraryItemEndpoint = () => `${apiBaseUrl}/itinerarioDetalle2`

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

// Get
export const fetchTableData = (table: string) => {
  return apiCall(tableDataEndpoint(table), 'GET')
}
export const fetchOneItem = (table: string, code: string) => {
  return apiCall(searchOneItemEndpoint(table, code), 'GET')
}
export const fetchSearchedItems = async (params: { searchTerm: string, table: string }) => {
  return apiCall(searchedItemsEndpoint(params), 'GET')
}
export const fetchUserData = async (params: { code: string, table: string }) => {
  return apiCall(userDataEndpoint(params), 'GET')
}
export const fetchItinerary = async (params: { salesperson: string, year: string, month: string }) => {
  return apiCall(itineraryEndpoint(params), 'GET')
}
export const fetchLastItems = () => {
  return apiCall(lastItemsEndpoint(), 'GET')
}
export const fetchReasons = () => {
  return apiCall(reasonsEndpoint(), 'GET')
}

// Post
export const fetchSendData = async (order: OrderInterface) => {
  return apiCall(sendDataEndpoint(), 'POST', order)
}

// Put
export const fetchItineraryItem = (data: { numero: string, coordenadas: string, observacion: string, motivo: string, fecha: string }) => {
  return apiCall(itineraryItemEndpoint(), 'PUT', data)
}