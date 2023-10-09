import { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { AlertDialog, Button, Modal } from 'native-base'
import useInv from '../../hooks/useInv'
import useLogin from '../../hooks/useLogin'
import { ProductInterface } from '../../utils/interfaces'
import { getDate, getHour, twoDecimalsPrice } from '../../utils/helpers'
import { fetchSendData } from '../../utils/api'

const ProcessOrder = ({ fullProductsCart }: { fullProductsCart: any }) => {
  const [alertProcessOrder, setAlertProcessOrder] = useState(false)
  const [alertSuccessOrder, setAlertSuccessOrder] = useState(false)
  const [alertErrorOrder, setAlertErrorOrder] = useState(false)
  const [send, setSend] = useState(false)

  const { themeColors: { background, icon, typography, turquoise, green, processBtn, darkTurquoise, primary }, myUser: { access: { customerAccess, labAccess }, nombre, cliente, us_codigo, customer } } = useLogin()
  const { iva, setIva, discount, setSubtotal, setProductsCart, setDiscount, setTotal, subtotal, total, productsCart, order, setOrder, loaders, setLoaders } = useInv()

  const cancelRef = useRef(null)
  const onCloseAlertProcessOrder = () => setAlertProcessOrder(false)

  // -----------------------------------------------
  // ACTIONS
  // -----------------------------------------------

  // Subtotal, discount, total...
  useEffect(() => {
    // subtotal
    const subtotal = fullProductsCart.reduce((accumulator: number, product: ProductInterface) => accumulator + product.precio1 * product.amount, 0)
    const subtotalFormated = twoDecimalsPrice(subtotal)
    setSubtotal(subtotalFormated)
    
    // subtotal base 1 (no iva)
    const subtotalBase1 = fullProductsCart.reduce((accumulator: number, product: ProductInterface) => accumulator + product.base1 * product.amount, 0)

    // discount
    const discount = fullProductsCart.reduce((accumulator: number, product: ProductInterface) => accumulator + (((Number(product.discount) * subtotalBase1)) / 100), 0)
    const discountFormated = twoDecimalsPrice(discount)
    setDiscount(discountFormated)

    // iva
    const iva = fullProductsCart.reduce((accumulator: number, product: ProductInterface) => accumulator + (((Number(product.iva) * subtotalBase1) / 100)), 0)
    const ivaFormated = twoDecimalsPrice(iva)
    setIva(ivaFormated)

    // total
    const total = (subtotalBase1 - discount) + iva
    const totalFormated = twoDecimalsPrice(total)
    setTotal(totalFormated)
  }, [fullProductsCart])

  
  // -----------------------------------------------
  // ORDER
  // -----------------------------------------------

  // Send order
  useEffect(() => {
    const sendOrder = async () => {
      try {
        if (send) {
          const res = await fetchSendData(order)

          if (res?.message) {
            setProductsCart([])
            setAlertSuccessOrder(true)
            setOrder({
              ...order,
              date: '',
              hora: '',
              cliente: {
                name: '',
                code: '',
                usuario: ''
              },
              productos: [],
              subtotal: '',
              total: '',
            })
            setSend(false)
          } else {
            // network error
            setAlertErrorOrder(true)
          }
        }
      } catch (error) {
        setAlertErrorOrder(true)
      }
    }
    sendOrder()
  }, [order])

  // Process order
  const handleProcess = () => {
    setLoaders({ ...loaders, loadingConfirmOrder: true })

    // order
    setOrder({
      ...order,
      date: getDate(new Date()),
      hora: getHour(new Date()),
      cliente: customerAccess ? {
        name: String(nombre),
        usuario: String(cliente),
        code: String(cliente)
      } : {
        name: String(customer?.nombre),
        usuario: String(us_codigo),
        code: String(customer?.cliente)
      },
      productos: fullProductsCart.map((product: ProductInterface) => ({
        codigo: String(product.codigo),
        descrip: String(product.descrip),
        base1: Number(product.base1),
        precio1: Number(product.precio1),
        iva: Number(product.iva),
        cantidad: Number(product.amount),
        descuento: labAccess ? String(product.discount) : String(0),
      })),
      subtotal: String(subtotal),
      total: String(total),
    })
    
    // close process alert
    setAlertProcessOrder(false)
    setSend(true)
  }

  return (
    <>
      <View className='flex flex-col justify-center w-[100%] bottom-0 absolute border-t-[0.5px] border-t-[#999999]'
        style={{ height: wp(parseFloat(discount) > 0 || parseFloat(iva) > 0 ? 40 : 32) }}
      >
        <View className='flex flex-col justify-center h-full w-[92%]'
          style={{ backgroundColor: background, borderTopColor: icon, marginLeft: 16 }}
        >
          {productsCart?.length !== 0 && (
            <View className='px-2'>

              {/* subtotal */}
              <View className='flex flex-row justify-between'>
                <Text style={{ fontSize: wp(4.2), color: typography }} className='font-semibold'>
                  Subtotal:
                </Text>
                <Text style={{ fontSize: wp(4.2), color: typography, }} className='font-semibold'>
                  Bs. {subtotal}
                </Text>
              </View>

              {/* discount */}
              {parseFloat(discount) > 0 && (
                <View className='flex flex-row justify-between'>
                  <Text style={{ fontSize: wp(4.2), color: turquoise }} className='font-semibold'>
                    Descuento:
                  </Text>
                  <Text style={{ fontSize: wp(4.2), color: turquoise }} className='font-semibold'>
                    -Bs. {discount}
                  </Text>
                </View>
              )}

              {/* iva */}
              {parseFloat(iva) > 0 && (
                <View className='flex flex-row justify-between'>
                  <Text style={{ fontSize: wp(3.7), color: green }} className='font-semibold'>
                    IVA:
                  </Text>
                  <Text style={{ fontSize: wp(3.7), color: green }} className='font-semibold'>
                    +Bs. {iva}
                  </Text>
                </View>
              )}

              {/* total */}
              <View className='flex flex-row justify-between'>
                <Text style={{ fontSize: wp(5), color: typography }} className='mb-2 font-extrabold'>
                  Total:
                </Text>
                <Text style={{ fontSize: wp(5), color: typography, }} className='font-extrabold mb-2'>
                  Bs. {total}
                </Text>
              </View>
            </View>
          )}

          {/* btn process */}
          <View className='rounded-xl py-3' style={{ backgroundColor: `${productsCart?.length === 0 ? processBtn : green}`}}>
            <TouchableOpacity onPress={() => setAlertProcessOrder(true)}
              disabled={productsCart?.length === 0 ? true : false}
            >
              <Text className='text-center font-bold text-white' style={{ fontSize: wp(5) }}>
                Procesar pedido {productsCart?.length === 0 ? '' : `(${productsCart?.length})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* alert process order */}
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertProcessOrder} onClose={onCloseAlertProcessOrder}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Confirmar pedido</AlertDialog.Header>

          <AlertDialog.Body>
            <Text className='font-normal' style={{ color: typography }}>
              ¿Estás seguro de procesar el pedido?
            </Text>
          </AlertDialog.Body>

          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant='unstyled' colorScheme='coolGray' onPress={onCloseAlertProcessOrder} ref={cancelRef}>
                Cancelar
              </Button>
              <Button color={darkTurquoise} onPress={handleProcess}>
                <Text className='font-normal text-white'>Confirmar</Text>
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      {/* alert success order */}
      <Modal isOpen={alertSuccessOrder} onClose={() => setAlertSuccessOrder(false)} animationPreset='fade'>
        <Modal.Content style={{ width: 360, height: 500, backgroundColor: primary, marginBottom: 0 }}>
          <View className='flex flex-1 flex-col items-center justify-between'>
            
            {/* logo */}
            <View className='mt-4'>
              {!customer?.cliente ? (
                <Image style={{ width: wp(40), height: wp(20) }} resizeMode='contain'
                  source={require('../../assets/logo-drocerca.png')}
                />
              ): (
                <Image style={{ width: wp(40), height: wp(20) }} resizeMode='contain'
                  source={require('../../assets/certra-process.png')}
                />  
              )}
            </View>

            {/* message */}
            <View className='flex flex-col justify-center items-center'>
              <Image style={{ width: wp(35), height: wp(25) }} resizeMode='contain'
                source={require('../../assets/cart-check.png')}
              />
              <Text className='w-52 pt-4 text-center text-white' style={{ fontSize: wp(6) }}>
                Su pedido ha sido procesado con éxito
              </Text>
            </View>

            {/* btn ok */}
            <View className='w-64 mb-8 mx-4'>
              <TouchableOpacity style={{ backgroundColor: green }} className='rounded-xl'
                onPress={() => setAlertSuccessOrder(false)} 
              >
                <Text className='p-3 text-center text-white' style={{ fontSize: wp(6) }}>Ok</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </Modal.Content>
      </Modal>

      {/* alert error order */}
      <Modal isOpen={alertErrorOrder} onClose={() => setAlertErrorOrder(false)} animationPreset='fade'>
        <Modal.Content style={{ width: 360, height: 500, backgroundColor: processBtn, marginBottom: 0 }}>
          <View className='flex flex-1 flex-col items-center justify-between'>
            <View />
            
            {/* message */}
            <View className='flex flex-col justify-center items-center'>
              <Image style={{ width: wp(35), height: wp(25) }} resizeMode='contain'
                source={require('../../assets/cart-error.png')}
              />
              <Text className='w-52 pt-4 text-center text-white' style={{ fontSize: wp(6) }}>
                Su pedido no ha sido procesado
              </Text>
            </View>

            {/* btn retry */}
            <View className='w-64 mb-8 mx-4'>
              <TouchableOpacity style={{ backgroundColor: green }} className='rounded-xl'
                onPress={() => setAlertErrorOrder(false)} 
              >
                <Text className='p-3 text-center text-white' style={{ fontSize: wp(6) }}>Volver a intentarlo</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default ProcessOrder