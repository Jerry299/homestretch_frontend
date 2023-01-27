import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: "",
    role: "guest",
    email: "",
    fname: "",
    lname: "",
    phone: "",
    birth_date: null,
    veteran_status: "",
    home_buying_status: "",
    race: "",
    address1: "",
    address2: "",
    city: "",
    zipcode: "",
    employment_status: "",
    income: "",
    debt_to_income: "",
    credit_score: "",
    when: "",
    house_type: "",
    budget: "",
    where: "",
    inactive: "",
    avatar: "",
    firs_update_date: null,
  },
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state = initialState, { payload }) => {
      state.user = payload;
    },
  },
});

export const { updateUser } = userReducer.actions;
export default userReducer.reducer;
