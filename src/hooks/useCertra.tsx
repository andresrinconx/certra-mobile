import { useContext } from 'react'
import CertraContext from '../context/CertraProvider'

const useCertra = () => {
  return useContext(CertraContext)
}

export default useCertra