import { configureStore } from "@reduxjs/toolkit";
import booleanReducer from './features/counter/booleanSlice';

export default configureStore({
    reducer: {
        alternateState: booleanReducer,
    }
})