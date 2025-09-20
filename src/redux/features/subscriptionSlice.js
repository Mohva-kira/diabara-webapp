import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subs:{}
}

const subscriptionSlice = createSlice({
  name: 'subs',
  initialState,
  reducers: {
    setSubs: (state, action) => {
      console.warn('yess', action.payload)
      state.subs = action.payload;
     
     

   
    },

  
  },
});

export const { setSubs, } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
