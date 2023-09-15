import axios from 'axios'
import { OrderInterface } from '../interfaces/OrderInterface'

// -----------------------------------------------
// ENDPOINTS
// -----------------------------------------------

// GET
const tableDataEndpoint = (table: string) => `http://drocerca.proteoerp.org:7070/proteoerp/app/${table}`
const searchOneItemEndpoint = (table: string, code: string) => `http://drocerca.proteoerp.org:7070/proteoerp/app/${table}/${code}`
const searchedItemsEndpoint = (params: { searchTerm: string, table: string }) => `http://drocerca.proteoerp.org:7070/proteoerp/app/${params.table}/${params.searchTerm}`
const userDataEndpoint = (params: { code: string, table: string }) => `http://drocerca.proteoerp.org:7070/proteoerp/app/${params.table}/${params.code}`

// POST
const sendDataEndpoint = () => `http://drocerca.proteoerp.org:7070/proteoerp/app/pedidoguardar`

// -----------------------------------------------
// FUNCTIONS
// -----------------------------------------------

// Get all data from a table
export const fetchTableData = async (table: string) => {
  const generalEndpointUrl = tableDataEndpoint(table)
  try {
    const response = await fetch(generalEndpointUrl)
    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}

// Get one item from a table that matches a code
export const fetchOneItem = async (table: string, code: string) => {
  const oneItemEndpointUrl = searchOneItemEndpoint(table, code)
  try {
    const response = await fetch(oneItemEndpointUrl)
    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}

// Get all data from a table that matches a search term
export const fetchSearchedItems = async (params: { searchTerm: string, table: string }) => {
  const searchedItemsUrl = searchedItemsEndpoint(params)
  try {
    const response = await fetch(searchedItemsUrl)
    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}

// Get all info from a user
export const fetchUserData = async (params: { code: string, table: string }) => {
  const userDataUrl = userDataEndpoint(params)
  try {
    const response = await fetch(userDataUrl)
    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}

// Send a order to the server
export const sendData = async (order: OrderInterface) => {
  const sendDataUrl = sendDataEndpoint()
  try {
    console.log(order)
    const response = await axios.post(sendDataUrl, order, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(response.data)
  } catch (error) {
    console.error('Error en la solicitud:', error)
  }
}
