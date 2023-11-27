import { createContext, useState, useEffect } from 'react';
import { ProductInterface, ProductCartInterface } from '../utils/interfaces';
import { setDataStorage } from '../utils/asyncStorage';
import { fetchSearchedItems } from '../utils/api';
import { useLogin } from '../hooks';

interface CertraContextProps {
  productsCart: ProductCartInterface[]
  setProductsCart: (productsCart: ProductCartInterface[]) => void
  products: ProductInterface[]
  setProducts: (products: ProductInterface[]) => void
  loadingProductsGrid: boolean
  setLoadingProductsGrid: (loadingProductsGrid: boolean) => void
  loadingSelectCustomer: boolean
  setLoadingSelectCustomer: (loadingSelectCustomer: boolean) => void
  loadingProducts: boolean
  setLoadingProducts: (loadingProducts: boolean) => void
  removeElement: (codigo: string) => void
  addToCart: (codigo: string, amount: number) => void
  getProducts: () => void
  currentPage: number
  setCurrentPage: (currentPage: number) => void
  reloadItinerary: boolean
  setReloadItinerary: (reloadItinerary: boolean) => void
  lookAtPharmacy: boolean
  setLookAtPharmacy: (lookAtPharmacy: boolean) => void
}
const CertraContext = createContext({} as CertraContextProps);

export const CertraProvider = ({ children }: { children: React.ReactNode }) => {
  // PRODUCTS
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // CART & ORDER 
  const [productsCart, setProductsCart] = useState<ProductCartInterface[]>([]); // code and amount

  // LOADERS
  const [loadingProductsGrid, setLoadingProductsGrid] = useState(true);
  const [loadingSelectCustomer, setLoadingSelectCustomer] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ITINERARY & ORDER RECORD
  const [reloadItinerary, setReloadItinerary] = useState(false);
  const [lookAtPharmacy, setLookAtPharmacy] = useState(false);
  
  const { myUser } = useLogin();

  // -----------------------------------------------
  // STORAGE
  // -----------------------------------------------

  // Set productsCart
  useEffect(() => {
    const setProductsStorage = async () => {
      try {
        await setDataStorage('productsCart', productsCart);
      } catch (error) {
        console.log(error);
      }
    };
    setProductsStorage();
  }, [productsCart]);

  // -----------------------------------------------
  // API
  // -----------------------------------------------

  // Get products api
  const getProducts = async () => {
    try {
      let data: ProductInterface[] = [];

      // fetch data
      if (myUser?.access?.customerAccess || myUser?.access?.salespersonAccess) {

        // inv farmacia
        data = await fetchSearchedItems({ table: 'appSinv/sinv', searchTerm: `${currentPage}` });
      } else if(myUser?.access?.labAccess) {

        // inv lab
        data = await fetchSearchedItems({ table: 'appSinv/searchclipr', searchTerm: `${myUser?.clipro}/${currentPage}` });
      }

      if (data?.length > 0) {
        setProducts([ ...products, ...data ]);
        setLoadingProducts(false);
        setLoadingProductsGrid(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // -----------------------------------------------
  // CART ACTIONS
  // -----------------------------------------------

  // Add to cart
  const addToCart = (codigo: string, amount: number) => {
    setProductsCart([ ...productsCart, { codigo, amount, labDiscount: '0' } ]);
  };

  // Remove element from cart
  const removeElement = (codigo: string) => {
    const updatedProductsCart = productsCart.filter(item => item.codigo !== codigo);
    setProductsCart(updatedProductsCart);
  };

  return (
    <CertraContext.Provider value={{
      productsCart,
      setProductsCart,
      products,
      setProducts,
      loadingProductsGrid,
      setLoadingProductsGrid,
      setLoadingSelectCustomer,
      loadingProducts,
      setLoadingProducts,
      loadingSelectCustomer,
      removeElement,
      addToCart,
      getProducts,
      currentPage,
      setCurrentPage,
      reloadItinerary,
      setReloadItinerary,
      lookAtPharmacy,
      setLookAtPharmacy,
    }}>
      {children}
    </CertraContext.Provider>
  );
};

export default CertraContext;