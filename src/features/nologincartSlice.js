import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";
//appApi

const initialState = { count: 0, total: 0 };

const nologincartSlice = createSlice({
    name: 'nologincart',
    initialState: { count: 0, total: 0 },
    reducers: {
      addtonologincart: (state, action) => {
        const { prodId, quantity, price } = action.payload;

        if(!state)
        {
          state = {total: 0, count: 0}
        }

        if(state[prodId]){
          state[prodId] += Number(quantity);
          } else {
            state[prodId] = Number(quantity);
          }
          state.count += Number(quantity);
          state.total = Number(state.total) + (Number(price)*Number(quantity));
          const serializedState = JSON.stringify(state);
          localStorage.setItem('nologincart', serializedState);
      },
      emptyNologincart: (state) => {
          // Reset the state to its initial values
        return {
          count: 0,
          total: 0,
        };
      },
      incrementnologincart: (state, action) => {
        const { prodId,price } = action.payload;
        state.total += Number(price);
        state.count += 1;
        state[prodId] += 1;
        const serializedState = JSON.stringify(state);
          localStorage.setItem('nologincart', serializedState);
      },
      decrementnologincart: (state, action) => {
        const { prodId,price } = action.payload;
        state.total -= Number(price);
        state.count -= 1;
        state[prodId] -= 1;
        const serializedState = JSON.stringify(state);
          localStorage.setItem('nologincart', serializedState);
      },
     removefromnologincart: (state, action) => {
      const {prodId, price} = action.payload;
      state.total -= Number(state[prodId]) * Number(price);
      state.count -= state[prodId];
      delete state[prodId];
      const serializedState = JSON.stringify(state);
          localStorage.setItem('nologincart', serializedState);
      },
      setNologincart: (_, action) => {
        return action.payload;
      },
    },
  });

export const {addtonologincart, incrementnologincart, decrementnologincart,removefromnologincart,setNologincart,emptyNologincart} = nologincartSlice.actions;
export default nologincartSlice.reducer;