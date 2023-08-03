import { useContext } from "react"
import LoginContext from "../context/LoginProvider"

const useLogin = () => {
  return useContext(LoginContext)
}

export default useLogin