import { createSlice } from "@reduxjs/toolkit";

export const userReducer = createSlice({
  name: "user",
  initialState: {
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
  },
  reducers: {
    changeState: (state, action) => {
      state = { ...state, ...action.payload };
    },
  },
});
