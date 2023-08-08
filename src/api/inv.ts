import {URL_API} from '@env'

// promise all !!
const searchedProductsEndpoint = (params: {searchTerm: string}) => `${URL_API}Sinv/search/${params.searchTerm}`

export const fetchSinv = async (params: {searchTerm: string}) => {
  let searchedProductsUrl = searchedProductsEndpoint(params)
  try {
    const response = await fetch(searchedProductsUrl)
    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}