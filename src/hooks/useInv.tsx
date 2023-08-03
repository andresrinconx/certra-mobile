import { useContext } from "react"
import InvContext from "../context/InvProvider"

const useInv = () => {
  return useContext(InvContext)
}

export default useInv