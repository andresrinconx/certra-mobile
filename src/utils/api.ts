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

// Post
const sendDataEndpoint = () => `${apiBaseUrl}/pedidoguardar`

// -----------------------------------------------
// API CALL
// -----------------------------------------------

const apiCall = async (endpoint: string, method: Uppercase<string>, data?: any)=>{
  try {
    const response = await axios.request({
      method,
      url: endpoint,
      data: data ? data : null
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

// Post
export const fetchSendData = async (order: OrderInterface) => {
  return apiCall(sendDataEndpoint(), 'POST', order)
}