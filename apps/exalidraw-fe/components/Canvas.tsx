import { useEffect,useRef,useState } from "react";
import { initDraw } from "@/draw";
import IconButton from "./IconButton";
import { ArrowBigLeft, ArrowBigRight, Circle,Diamond,Pencil, RectangleCircle,RectangleHorizontalIcon } from "lucide-react";

export type Tool = "circle" | "rect" | "pencil";

export function Canvas({roomId,socket}:{roomId:string,socket:WebSocket}){
    const canvasref= useRef<HTMLCanvasElement>(null);
    const [selectedTool,setSelectedTool] = useState<Tool>('pencil');

    useEffect(()=>{
        if(canvasref.current){
            initDraw(canvasref.current,roomId,socket);
        }
    },[canvasref]);

    return <div style={{
        height: '100vh',
         background: 'red',
        overflow: 'hidden'
    }}>
        <canvas ref={canvasref} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
            position: "fixed",
            top: 10,
            left: 10
        }}>
            <div className="flex gap-t">
                <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconButton onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
            </div>
        </div>
}