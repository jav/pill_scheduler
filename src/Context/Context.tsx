import React from "react";

import { Pill } from '../Types/Pill';
import Administration from '../Types/Administration';
import AdministrationList from "../Types/AdministrationList";
import { roundTime } from '../Functions/roundTime';

export interface IContext {
    administrationList: AdministrationList,
    error: string | null,
    time: Date,
    realtimeClockMode: boolean
};

export const initialState: IContext = {
    administrationList: new AdministrationList([]),
    error: null,
    time: roundTime(new Date(), 15000),
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
        pill: Pill,
        dose: number
    }
}
export const addAdministration = (time: Date, pill: Pill, dose: number): ActionAddAdministration => {
    return {
        type: ADD_ADMINISTRATION,
        payload: { time: time, pill: pill, dose: dose }
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
            const adm = new Administration(payload.time, payload.pill, payload.dose);
            const newAdministrationsList = new AdministrationList(state.administrationList).addAdministration(adm);
            return {
                ...state,
                administrations: newAdministrationsList
            }
                ;
        default:
            return state;
    }
}
