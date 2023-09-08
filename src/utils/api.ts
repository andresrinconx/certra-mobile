import { LOCAL_API_URL, API_URL } from "@env";
import { OrderInterface } from "../interfaces/OrderInterface";
import axios from "axios";

// GET

// get all data from a table
const tableDataEndpoint = (table: string) => `${API_URL}/${table}`;

// get all data from a table that matches a search term
const searchedItemsEndpoint = (params: { searchTerm: string; table: string }) =>
  `${API_URL}/${params.table}/${params.searchTerm}`;

// get all info from a user
const userDataEndpoint = (params: { code: string; table: string }) =>
  `${API_URL}/${params.table}/${params.code}`;

// POST

// send a order to the server
const sendDataEndpoint = () => `${API_URL}/pedidoguardar`;

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

export const fetchSearchedItems = async (params: {
  searchTerm: string;
  table: string;
}) => {
  const searchedItemsUrl = searchedItemsEndpoint(params);
  try {
    const response = await fetch(searchedItemsUrl);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserData = async (params: {
  code: string;
  table: string;
}) => {
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
