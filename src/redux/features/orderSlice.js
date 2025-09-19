import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  order:{
  transaction_id: '', // YOUR TRANSACTION ID
  amount: 0,
  currency: 'XOF',
  channels: 'ALL',
  description: '',   
   //Fournir ces variables pour le paiements par carte bancaire
  customer_name:"",//Le nom du client
  customer_surname:"",//Le prenom du client
  customer_email: "",//l'email du client
  customer_phone_number: "",//l'email du client
  customer_address : "",//addresse du client
  customer_city: "",// La ville du client
  customer_country : "CM",// le code ISO du pays
  customer_state : "CM",// le code ISO l'état
  customer_zip_code : "06510", // code postal
}
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action) => {
      console.warn('active', action.payload)
      state.order = action.payload;
     
     

   
    },

  
  },
});

export const { setOrder, } = orderSlice.actions;

export default orderSlice.reducer;
