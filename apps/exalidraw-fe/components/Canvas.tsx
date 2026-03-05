import { useCallback, useEffect,useRef,useState } from "react";
import { Hand, Circle,Diamond,Pencil, Minus,RectangleHorizontalIcon,ZoomIn,ZoomOut,Undo2,Redo2 } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "rect"
  | "ellipse"
  | "diamond"
  | "pencil"
  | "line"
  | "hand";//panning

export function Canvas({roomId,socket}:{roomId:string,socket:WebSocket}){
    const canvasref= useRef<HTMLCanvasElement>(null);
    const [game,setGame] = useState<Game>();
    const [selectedTool,setSelectedTool] = useState<Tool>('pencil');

    useEffect(()=>{
      game?.setSelectedTool(selectedTool);
    },[selectedTool,game]);

    useEffect(()=>{
        if(canvasref.current){
            const g = new Game(canvasref.current,roomId,socket);
            setGame(g);
            return () => g.destroy();
        }
    },[roomId,socket]);

    useEffect(()=>{
        const handleresize = () => {
        if(!canvasref.current)return;
        canvasref.current.width = window.innerWidth;
        canvasref.current.height = window.innerHeight;

      }
      handleresize();
      window.addEventListener('resize',handleresize);
      return ()=>window.removeEventListener('resize',handleresize);
    },[game]);

    return <div style={{
        height: '100vh',
         background: 'transparent',
        overflow: 'hidden'
    }}>
        <canvas ref={canvasref} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool}  />
    </div>
}

function Topbar({
  selectedTool,
  setSelectedTool,
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        padding: "8px 14px",
        borderRadius: "14px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <ToolButton active={selectedTool === "hand"} onClick={() => (setSelectedTool("hand"))} icon={<Hand size={18} />} />
      <ToolButton active={selectedTool === "pencil"} onClick={() => (setSelectedTool("pencil"))} icon={<Pencil size={18} />} />
      <ToolButton active={selectedTool === "line"} onClick={() => (setSelectedTool("line"))} icon={<Minus size={18} />} />
      <ToolButton active={selectedTool === "rect"} onClick={() => (setSelectedTool("rect"))} icon={<RectangleHorizontalIcon size={18} />} />
      <ToolButton active={selectedTool === "ellipse"} onClick={() => (setSelectedTool("ellipse"))} icon={<Circle size={18} />} />
      <ToolButton active={selectedTool === "diamond"} onClick={() => (setSelectedTool("diamond"))} icon={<Diamond size={18} />} />

      <Divider />
     
      <ToolButton onClick={onZoomOut} icon={<ZoomOut size={18} />} />
      <ToolButton onClick={onZoomIn} icon={<ZoomIn size={18} />} />

      <Divider />

      <ToolButton onClick={onUndo} icon={<Undo2 size={18} />} />
      <ToolButton onClick={onRedo} icon={<Redo2 size={18} />} />
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  icon,
}: {
  active?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        background: active ? "#111" : "transparent",
        color: active ? "#fff" : "#333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "#eee";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      {icon}
    </button>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: "1px",
        height: "24px",
        background: "#000",
        margin: "0 6px",
      }}
    />
  );
}