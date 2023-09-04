import { createSlice } from '@reduxjs/toolkit';

export const booleanSlice = createSlice({
    name: 'booleanSwitch',
    initialState: {
        value: false,
    },
    reducers: {
        alternateValue: (state) => {
            state.value = !state.value
        }
    }
});

export const { alternateValue } = booleanSlice.actions;
export default booleanSlice.reducer;