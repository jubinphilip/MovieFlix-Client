'use client'
//import type { RootState } from "../user/Redux/store";
//import { UseSelector,useDispatch, useSelector } from "react-redux";
//import { increment,decrement,incrementByAmount } from "../user/Redux/Feautures/counter/counterslice";

export default function Home() {

  return (
    <main >
      <div>
        <label>Register new User</label>
        <a href="/user/signup"><button>Register</button></a>
        <label>Already have an account?</label>
        <a href="/user/signin"><button>Signin</button></a>
        <a href="/admin">Login as an admin</a>

      </div>
    </main>
  );
}
