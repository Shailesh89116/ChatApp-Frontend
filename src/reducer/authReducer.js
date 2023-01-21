import { createSlice } from "@reduxjs/toolkit";

export const authSlice=createSlice({
    name:"auth",
    initialState:{
        isAuthenticated:false,
        user:{}
    },
    
    reducers:{
        setUser:(state,payload)=>{
            state.user=payload,
            state.isAuthenticated=true
        }
    }
});

export const {setUser}=authSlice.actions;
export default authSlice.reducer;