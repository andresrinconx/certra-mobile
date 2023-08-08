import {URL_API} from '@env'

// promise all !!
const searchedProductsEndpoint = (params: {searchTerm: string}) => `${URL_API}Sinv/search/${params.searchTerm}`

export const fetchSinv = (params: {searchTerm: string}) => {
    let locationsUrl = locationsEndpoint(params);
    return apiCall(locationsUrl);
}