import React, { Context } from "react";
import Reducer from './Reducer'

export interface IContext {
    counter: number,
    list: number[],
    administrations: Object[],
    error: string | null
};

export const initialState: IContext = {
    counter: 0,
    list: [4,5],
    administrations: [],
    error: null
};

const context = React.createContext<typeof initialState>(initialState);
export const AppContextProvider = context.Provider;
export const AppContextConsumer = context.Consumer;