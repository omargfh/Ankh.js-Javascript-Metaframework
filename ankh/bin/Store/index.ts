// Credit to Mohamed Faisal (https://blog.logrocket.com/use-redux-next-js/#building-sample-next-js-application-redux)
import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "@ankh/bin/Store/Auth/authSlice";
import { createWrapper } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";

const rootReducer = combineReducers({
    [authSlice.name]: authSlice.reducer,
});

const makeConfiguredStore = () =>
configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
    },
    devTools: (process.env.NODE_ENV !== "production") ? true : false
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
AppState,
unknown,
Action
>;

export const makeStore = () => {
    const isServer = typeof window === "undefined";
    if (isServer) {
        return makeConfiguredStore();
    } else {
        // we need it only on client side
        const persistConfig = {
            key: "nextjs",
            whitelist: ["auth"], // make sure it does not clash with server keys
            storage,
        };
        const persistedReducer = persistReducer(persistConfig, rootReducer);
        let store: any = configureStore({
            reducer: persistedReducer,
            devTools: process.env.NODE_ENV !== "production",
        });
        store.__persistor = persistStore(store); // Nasty hack
        return store;
    }
};


export const wrapper = createWrapper<AppStore>(makeStore);