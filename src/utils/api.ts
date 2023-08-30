import {API_LOCAL, API_REMOTE} from '@env'

const tableDataEndpoint = (table: string) => `${API_REMOTE}${table}`
const searchedItemsEndpoint = (params: {searchTerm: string, table: string}) => `${API_LOCAL}/searchCli/${params.searchTerm}`

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