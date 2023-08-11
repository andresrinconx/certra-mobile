import {URL_API, URL_API_2} from '@env'

const tableDataEndpoint = (table: string) => `${URL_API}${table}`
const searchedProductsEndpoint = (params: {searchTerm: string}) => `${URL_API}Sinv/search/${params.searchTerm}`

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

export const fetchSinv = async (params: {searchTerm: string}) => {
  const searchedProductsUrl = searchedProductsEndpoint(params)
  try {
    const response = await fetch(searchedProductsUrl)
    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}