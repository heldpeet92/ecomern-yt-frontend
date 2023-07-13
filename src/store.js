import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./features/productSlice";
import userSlice from "./features/userSlice";
import nologincartSlice from "./features/nologincartSlice";
import appApi from "./services/appApi";

//persit our store
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

//reducers
const reducer = combineReducers({
    user: userSlice,
    products: productSlice,
    nologincart : nologincartSlice,
    [appApi.reducerPath]: appApi.reducer,
});

const persistConfig = {
    key: "root",
    storage,
    blackList: [appApi.reducerPath, "products"],
};
const initialState = {};
// persist our store
const persistedReducer = persistReducer(persistConfig, reducer);

const nologincartInitialState = JSON.parse(localStorage.getItem('nologincart'));
// creating the store

initialState.nologincart = nologincartInitialState || {total: 0, count: 0};

const store = configureStore({
    reducer: persistedReducer,
    preloadedState: initialState,
    middleware: [thunk, appApi.middleware],
});

export default store;