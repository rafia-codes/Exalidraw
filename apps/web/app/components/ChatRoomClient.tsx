"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({messages,id}:{
    messages:{message:string}[],
    id:string
}){
    const { socket,loading } = useSocket();
    const [chats,setChats] = useState(messages);
    const [currMessage,setCurrMessage] = useState<string>('');

    useEffect(()=>{
        if(socket && !loading){

            socket.send(JSON.stringify({
                type:"join_room",
                roomId:id
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat"){
                    setChats(c => [...c,{ message : parsedData.message}]);
                }
            }
        }
    },[socket,loading]);

    return (<div>
        {chats.map((m,id)=> <div key={id}>{m.message}</div>)}
        <input type="text" onChange={e=>setCurrMessage(e.target.value)}/>
        <button onClick={()=>{
            socket?.send(JSON.stringify({
                type:"chat",
                roomId:id,
                message:currMessage
            }))
            setCurrMessage('');
        }}>
            Send Message
        </button>
    </div>)
}