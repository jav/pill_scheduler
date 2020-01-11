import React from "react";

import Administration from '../Types/Administration'

export interface IContext {
    administrations: Administration[],
    error: string | null,
    time: Date,
    realtimeClockMode: boolean
};

export const initialState: IContext = {
    administrations: [],
    error: null,
    time: new Date(),
    realtimeClockMode: true
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


export type ActionType = ActionSetRealtimeClockMode | ActionUpdateClock | ActionAddAdministration;

export const SET_REALTIMECLOCK_MODE = "SET_REALTIMECLOCK_MODE";
export interface ActionSetRealtimeClockMode {
    type: typeof SET_REALTIMECLOCK_MODE
    payload: { mode: boolean }
}
export const setRealtimeClockMode = (mode: boolean): ActionSetRealtimeClockMode => {
    return {
        type: SET_REALTIMECLOCK_MODE,
        payload: { mode: mode }
    }
}

export const UPDATE_CLOCK = "UPDATE_CLOCK";
export interface ActionUpdateClock {
    type: typeof UPDATE_CLOCK
    payload: { time: Date }
}
export const updateClock = (time: Date): ActionUpdateClock => {
    return {
        type: UPDATE_CLOCK,
        payload: {
            time: time
        }
    }
}

export const ADD_ADMINISTRATION = "ADD_ADMINISTRATION";
export interface ActionAddAdministration {
    type: typeof ADD_ADMINISTRATION
    payload: {
        time: Date,
        pillName: string
    }
}
export const addAdministration = (time: Date, pillName: string): ActionAddAdministration => {
    return {
        type: ADD_ADMINISTRATION,
        payload: { time: time, pillName: pillName }
    }
}

export const reducer = (state: IContext, action: ActionType) => {
    const type = action.type;
    const payload = action.payload;

    switch (type) {
        case SET_REALTIMECLOCK_MODE:
            return {
                ...state,
                realtimeClockMode: payload.mode
            }
        case UPDATE_CLOCK:
            return {
                ...state,
                time: payload.time
            }
        case ADD_ADMINISTRATION:
            const newAdministrationsList = [new Administration(payload.time, payload.pillName), ...state.administrations].sort(
                (a: Administration, b: Administration) => b.time.getTime() - a.time.getTime()
            )
            return {
                ...state,
                administrations: newAdministrationsList
            }
                ;
        default:
            return state;
    }
}
