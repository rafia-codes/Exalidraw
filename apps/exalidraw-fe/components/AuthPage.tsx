"use client";

export default function AuthPage({isSignIn}:{
    isSignIn:boolean
}){
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-2 m-2 bg-white rounded">
            <div className="p-2">
                <input type="text" placeholder="Email" name="" id="" />
            </div>
            <div className="p-2">
                <input type="text" placeholder="Password"/>
            </div>
            <div className="pt-2">
                <button onClick={()=>{

            }}>{isSignIn?"Sign In":"Sign Up"}</button>
            </div>
        </div>
    </div>
}