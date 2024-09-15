'use client';
import { createSlice ,PayloadAction } from "@reduxjs/toolkit";

type userState={
    userid:string,
    name:string,
    email:string,
    token:string | null;
}
const initialState:userState = {
    userid:'',
    name:"",
    email:"",
    token:null,
}
export const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action:PayloadAction<{userid:string,name:string;email:string;token:string}>)=>{
            state.userid=action.payload.userid
            state.name=action.payload.name;
            state.email=action.payload.email;
            state.token=action.payload.token
        },
        clearUser:(state)=>{
            state.userid=""
            state.name="";
            state.email="";
            state.token=null;
        },
    },
})
export const{setUser,clearUser}=userSlice.actions;
export default userSlice.reducer;