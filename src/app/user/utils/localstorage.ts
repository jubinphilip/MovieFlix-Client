export const saveState=(state:any)=>{
    try{
        const serializedState=JSON.stringify(state);
        localStorage.setItem('reduxState',serializedState)
    }
    catch(error){
        console.log(error)
    }
}
export const loadState=()=>{
    try{
        const serializedState=localStorage.getItem('reduxState');
        if(serializedState===null) return undefined;
        return JSON.parse(serializedState);
    }catch(error)
    {
        console.log("Error",error)
        return undefined
    }
}