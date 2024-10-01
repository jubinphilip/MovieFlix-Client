'use client'
export const saveState=(state:any)=>{
    try{
        const serializedState=JSON.stringify(state);
        localStorage.setItem('reduxState',serializedState)
    }
    catch(error){
        console.log(error)
    }
}//the items from redux is stored at localstorage and whenever a page reload occur redux calls this function and the data is stored to redux from localstorage
export const loadState=()=>{
    try{
        const serializedState=localStorage.getItem('reduxState');
        if(serializedState===null) 
            return undefined;
        return JSON.parse(serializedState);
    }catch(error)
    {
        console.log("Error",error)
        return undefined
    }
}