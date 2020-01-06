import React from "react";

import Administration from '../Types/Administration'

export interface IContext {
    administrations: Administration[],
    error: string | null
};

export const initialState: IContext = {
    administrations: [],
    error: null
};

interface ContextType {
    state: typeof initialState;
    dispatch: (action: ActionType) => void;
}

const context = React.createContext<ContextType>({
    state: initialState,
    dispatch: () => { }
});

export const AppContextProvider = context.Provider;
export const AppContextConsumer = context.Consumer;
export const AppContext = context;


export type ActionType = ActionAddAdministration;

export const ADD_ADMINISTRATION = "ADD_ADMINISTRATION";
export interface ActionAddAdministration {
    type: typeof ADD_ADMINISTRATION
    payload: string
}
export const addAdministration = (pillName: string): ActionAddAdministration => {
    return {
        type: ADD_ADMINISTRATION,
        payload: pillName
    }
}

export const reducer = (state: IContext, action: ActionType) => {
    switch (action.type) {
        case ADD_ADMINISTRATION:
            console.log("addAdministration, state:", state);
            return {
                ...state,
                administrations:
                    [...state.administrations, new Administration(0, "noname")]
            }
                ;
        default:
            return state;
    }
}
