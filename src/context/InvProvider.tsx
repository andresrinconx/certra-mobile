import { createContext, useState, useEffect } from "react"

const InvContext = createContext<{
  
}>({
  
})

export const InvProvider = ({children}: {children: React.ReactNode}) => {
  
  return (
    <InvContext.Provider value={{

    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext