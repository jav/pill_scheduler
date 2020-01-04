import React, { Context } from "react";
import Reducer from './Reducer'

import { AppContextProvider, initialState } from './Context'

const Store = ({ children }) => {
  const [state, dispatch] = React.useReducer(Reducer, initialState);
  return (
    <AppContextProvider value={initialState}>
      {children}
    </AppContextProvider>
  );
};

export default Store;


/*

      <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>

*/