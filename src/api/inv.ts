import {URL_API, URL_API_2} from '@env'

const tableDataEndpoint = (table: string) => `${URL_API}${table}`
const searchedItemsEndpoint = (params: {searchTerm: string, table: string}) => `${URL_API}${params.table}/search/${params.searchTerm}`

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

export const fetchSearchedItems = async (params: {searchTerm: string, table: string}) => {
  const searchedItemsUrl = searchedItemsEndpoint(params)
  try {
    const response = await fetch(searchedItemsUrl)
    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}