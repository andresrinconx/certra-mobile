import { useState } from 'react';

export const useForm = <T extends Record<string, any>>(initState: T) => {
   const [state, setState] = useState(initState);

   const setForm = (newValues: Partial<T>) => {
     setState(prevState => ({
       ...prevState,
       ...newValues
     }));
   };

   return {
     ...state,
     form: state,
     setForm
   };
};