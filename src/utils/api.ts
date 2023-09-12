import { LOCAL_API_URL, API_URL } from '@env'
import { OrderInterface } from "../interfaces/OrderInterface";
import axios from "axios";

// ----- GET
const tableDataEndpoint = (table: string) => `${LOCAL_API_URL}/${table}`;
const searchedItemsEndpoint = (params: { searchTerm: string; table: string }) => `${LOCAL_API_URL}/${params.table}/${params.searchTerm}`;
const userDataEndpoint = (params: { code: string; table: string }) => `${LOCAL_API_URL}/${params.table}/${params.code}`;

// ----- POST
const sendDataEndpoint = () => `${LOCAL_API_URL}/pedidoguardar`;

// get all data from a table
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

// get all data from a table that matches a search term
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

// get all info from a user
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

// send a order to the server
export const sendData = async (order: OrderInterface) => {
  const sendDataUrl = sendDataEndpoint();
  try {
    // axios
    console.log(order);
    const response = await axios.post(sendDataUrl, order, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
};
