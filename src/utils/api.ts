import axios from 'axios';
import { LOCAL_API_URL, API_URL } from '@env';
import { OrderInterface } from '../utils/interfaces';

const apiBaseUrl = 'http://192.168.230.19/proteoerp/sincro';

// -----------------------------------------------
// ENDPOINTS
// -----------------------------------------------

// LOGIN & PRODUCTS
const loginEndpoint = () => `${apiBaseUrl}/appUsuarios/login`;
const tableDataEndpoint = (table: string) => `${apiBaseUrl}/${table}`;
const searchOneItemEndpoint = (table: string, code: string) => `${apiBaseUrl}/${table}/${code}`;
const searchedItemsEndpoint = (params: { searchTerm: string, table: string }) => `${apiBaseUrl}/${params.table}/${params.searchTerm}`;
const datasheetEndpoint = (code: string) => `${apiBaseUrl}/appSinv/ficha/${code}`;
const sendDataEndpoint = () => `${apiBaseUrl}/appUsuarios/pedidoguardar`;
const psicotropicosEndpoint = () => `${apiBaseUrl}/appSinv/psicotropicos/1`;

// PROFILE
const profileDataEndpoint = (params: { code: string, table: string }) => `${apiBaseUrl}/${params.table}/${params.code}`;
const psicotropicosInfoEndpoint = () => `${apiBaseUrl}/appSinv/img`;

// ITINERARY
const itineraryEndpoint = (params: { salesperson: string, year: string, month: string }) => `${apiBaseUrl}/appItinerario/itinerarioP2/${params.salesperson}/${params.year}/${params.month}`;
const itineraryItemEndpoint = () => `${apiBaseUrl}/appItinerario/itinerarioDetalle2`;
const reasonsEndpoint = () => `${apiBaseUrl}/appItinerario/motivo`;
const dataCustomerEndpoint = (customer: string) => `${apiBaseUrl}/appItinerario/data/${customer}`;
const reasignEndpoint = () => `${apiBaseUrl}/appItinerario/reasignar`;

// ORDER RECORD
// customer
const lastItemsCustomerEndpoint = (customer: string) => `${apiBaseUrl}/appHistorial/historialPediC/${customer}`;
const rangeCustomerEndpoint = (params: { customer: string, dateFrom: string, dateTo: string }) => `${apiBaseUrl}/appHistorial/historialFarmacia/${params.customer}/${params.dateFrom}/${params.dateTo}`;

// lab
const lastItemsLabEndpoint = (params: { clipro: string, code: string }) => `${apiBaseUrl}/appHistorial/historialPedi/${params.clipro}/${params.code}`;
const lastItemsLabCustomerEndpoint = (params: { code: string, customer: string }) => `${apiBaseUrl}/appHistorial/historialPediFarmacia/${params.code}/${params.customer}`;
const rangeLabEndpoint = (params: { clipro: string, code: string, dateFrom: string, dateTo: string }) => `${apiBaseUrl}/appHistorial/historialGeneral/${params.clipro}/${params.code}/${params.dateFrom}/${params.dateTo}`;
const rangeLabCustomerEndpoint = (params: { customer: string, code: string, dateFrom: string, dateTo: string }) => `${apiBaseUrl}/appHistorial/rangoFarmaciaLab/${params.customer}/${params.code}/${params.dateFrom}/${params.dateTo}`;

// salesperson
const lastItemsSalespersonEndpoint = (salesperson: string) => `${apiBaseUrl}/appHistorial/pedidoUsuario/${salesperson}`;
const lastItemsSalespersonScliEndpoint = (params: { code: string, customer: string }) => `${apiBaseUrl}/appHistorial/pedidoUsuarioCli/${params.code}/${params.customer}`;
const rangeSalespersonEndpoint = (params: { code: string, dateFrom: string, dateTo: string }) => `${apiBaseUrl}/appHistorial/historialGeneralVendedor/${params.code}/${params.dateFrom}/${params.dateTo}`;
const rangeSalespersonCustomerEndpoint = (params: { customer: string, code: string, dateFrom: string, dateTo: string }) => `${apiBaseUrl}/appHistorial/historialVendedorCl/${params.customer}/${params.code}/${params.dateFrom}/${params.dateTo}`;

// -----------------------------------------------
// API CALL
// -----------------------------------------------

const apiCall = async (endpoint: string, method: Uppercase<string>, data?: unknown, headers?: Record<string, string>) => {
  try {
    const response = await axios.request({
      method,
      url: endpoint,
      data: data ? data : { },
      headers: headers ? headers : { }
    });
    return response.data;
  } catch(error) {
    console.log(error);
    // throw new Error(error)
  }
};

// -----------------------------------------------
// FUNCTIONS
// -----------------------------------------------

// LOGIN & PRODUCTS
export const fetchLogin = (data: { usuario: string, password: string }) => {
  return apiCall(loginEndpoint(), 'POST', data);
};
export const fetchTableData = (table: string) => {
  return apiCall(tableDataEndpoint(table), 'GET');
};
export const fetchOneItem = (table: string, code: string) => {
  return apiCall(searchOneItemEndpoint(table, code), 'GET');
};
export const fetchSearchedItems = async (params: { searchTerm: string, table: string }) => {
  return apiCall(searchedItemsEndpoint(params), 'GET');
};
export const fetchDatasheet = (code: string) => {
  return apiCall(datasheetEndpoint(code), 'GET');
};
export const fetchSendData = async (order: OrderInterface) => {
  return apiCall(sendDataEndpoint(), 'POST', order);
};
export const fetchPsicotropicos = () => {
  return apiCall(psicotropicosEndpoint(), 'GET');
};

// PROFILE
export const fetchProfileData = async (params: { code: string, table: string }) => {
  return apiCall(profileDataEndpoint(params), 'GET');
};
export const fetchPsicotropicosInfo = async (data: any) => {
  return apiCall(psicotropicosInfoEndpoint(), 'POST', data, { 'Content-Type': 'multipart/form-data' });
};

// ITINERARY
export const fetchItinerary = async (params: { salesperson: string, year: string, month: string }) => {
  return apiCall(itineraryEndpoint(params), 'GET');
};
export const fetchItineraryItem = (data: { id: string, coordenadas: string, observacion: string, motivo: string, fecha: string }) => {
  return apiCall(itineraryItemEndpoint(), 'PUT', data);
};
export const fetchReasons = () => {
  return apiCall(reasonsEndpoint(), 'GET');
};
export const fetchDataCustomer = (customer: string) => {
  return apiCall(dataCustomerEndpoint(customer), 'GET');
};
export const fetchReasign = (data: { usuario: string, id: string, fecha: string }) => {
  return apiCall(reasignEndpoint(), 'PUT', data);
};

// ORDER RECORD
// customer
export const fetchLastItemsCustomer = (customer: string) => {
  return apiCall(lastItemsCustomerEndpoint(customer), 'GET');
};
export const fetchRangeCustomer = (params: { customer: string, dateFrom: string, dateTo: string }) => {
  return apiCall(rangeCustomerEndpoint(params), 'GET');
};

// lab
export const fetchLastItemsLab = (params: { clipro: string, code: string }) => {
  return apiCall(lastItemsLabEndpoint(params), 'GET');
};
export const fetchLastItemsLabCustomer = (params: { code: string, customer: string }) => {
  return apiCall(lastItemsLabCustomerEndpoint(params), 'GET');
};
export const fetchRangeLab = (params: { clipro: string, code: string, dateFrom: string, dateTo: string }) => {
  return apiCall(rangeLabEndpoint(params), 'GET');
};
export const fetchRangeLabCustomer = (params: { customer: string, code: string, dateFrom: string, dateTo: string }) => {
  return apiCall(rangeLabCustomerEndpoint(params), 'GET');
};

// salesperson
export const fetchLastItemsSalesperson = (salesperson: string) => {
  return apiCall(lastItemsSalespersonEndpoint(salesperson), 'GET');
};
export const fetchLastItemsSalespersonCustomer = (params: { code: string, customer: string }) => {
  return apiCall(lastItemsSalespersonScliEndpoint(params), 'GET');
};
export const fetchRangeSalesperson = (params: { code: string, dateFrom: string, dateTo: string }) => {
  return apiCall(rangeSalespersonEndpoint(params), 'GET');
};
export const fetchRangeSalespersonCustomer = (params: { customer: string, code: string, dateFrom: string, dateTo: string }) => {
  return apiCall(rangeSalespersonCustomerEndpoint(params), 'GET');
};