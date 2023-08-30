// import Navigation from './src/components/Navigation'
// import { InvProvider } from './src/context/InvProvider'
// import { LoginProvider } from './src/context/LoginProvider'

// const App = () => {
//   return ( 
//     <LoginProvider>
//       <InvProvider>
//         <Navigation />
//       </InvProvider>
//     </LoginProvider>
//   )
// }

// export default App
import React from "react";
import { NativeBaseProvider, Box } from "native-base";

export default function App() {
  return (
    <NativeBaseProvider>
      <Box>Hello world</Box>
    </NativeBaseProvider>
  );
}