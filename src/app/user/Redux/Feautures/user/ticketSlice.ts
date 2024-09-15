import { createSlice,PayloadAction } from "@reduxjs/toolkit";
interface TicketState{
    showId:string,
    movieId:string,
    theatreId:string,
    showdate:string,
    timing:string
}
const initialState:TicketState={
    showId:'',
    movieId:'',
    theatreId:'',
    showdate:'',
    timing:'',
}
const ticketSlice=createSlice({
    name:'ticket',
    initialState,
    reducers:{
        setTicketDetails:(
            state,
            action:PayloadAction<{ movieId:string,theatreId:string,timing:string,showId:string, showdate:string,}>)=>
            {
                state.showId=action.payload.showId;
                state.movieId=action.payload.movieId;
                state.theatreId=action.payload.theatreId;
                state. showdate=action.payload.showdate;
                state.timing=action.payload.timing
            },
            resetTicketDetails:(state)=>{
                state.showId=''
                state.movieId='';
                state.showdate='';
                state.theatreId='';
                state.timing='';
            }
    }
    })
    export const{setTicketDetails,resetTicketDetails}=ticketSlice.actions
    export default ticketSlice.reducer