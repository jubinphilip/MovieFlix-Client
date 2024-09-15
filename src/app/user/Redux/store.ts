'use client';

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import ticketReducer from './Feautures/user/ticketSlice';
import userReducer from './Feautures/user/userslice';
import { loadState, saveState } from "../utils/localstorage";

export interface RootState {
  ticket: ReturnType<typeof ticketReducer>;
  user: ReturnType<typeof userReducer>;
}

const rootReducer = combineReducers({
  ticket: ticketReducer,
  user: userReducer,
});

const persistedState = loadState();

export const store = configureStore({
    reducer: rootReducer,
    preloadedState: persistedState as RootState
});

store.subscribe(() => {
    saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;

export default store;