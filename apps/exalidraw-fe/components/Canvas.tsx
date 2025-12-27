import { useEffect,useRef } from "react";
import { initDraw } from "@/app/draw";

export function Canvas({roomId,socket}:{roomId:string,socket:WebSocket}){
    const canvasref= useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        if(canvasref.current){
            initDraw(canvasref.current,roomId,socket);
        }
    },[canvasref]);

    return <div>
        <canvas ref={canvasref} width={1080} height={720}></canvas>
    </div>
}