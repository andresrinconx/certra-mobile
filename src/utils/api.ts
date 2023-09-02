import {API_LOCAL, API_REMOTE} from '@env';
import { OrderInterface } from '../interfaces/OrderInterface';

// get
const tableDataEndpoint = (table: string) => `${API_REMOTE}${table}`;
const searchedItemsEndpoint = (params: {searchTerm: string; table: string}) => `${API_REMOTE}/${params.table}/${params.searchTerm}`;
const userDataEndpoint = (params: {code: string; table: string}) => `${API_REMOTE}${params.table}/${params.code}`;

// post
const sendDataEndpoint = () => `${API_REMOTE}pedidoguardar`;

export const fetchTableData = async (table: string) => {
  const generalEndpointUrl = tableDataEndpoint(table);
  try {
    const response = await fetch(generalEndpointUrl);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const fetchSearchedItems = async (params: { searchTerm: string; table: string; }) => {
  const searchedItemsUrl = searchedItemsEndpoint(params);
  try {
    const response = await fetch(searchedItemsUrl);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserData = async (params: { code: string; table: string; }) => {
  const userDataUrl = userDataEndpoint(params);
  try {
    const response = await fetch(userDataUrl);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const sendData = async (order: OrderInterface) => {
  const sendDataUrl = sendDataEndpoint();
  try {
    await fetch(sendDataUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
};