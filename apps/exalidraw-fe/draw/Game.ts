import getExistingShapes from "./http";
import { Tool } from "../components/Canvas";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "ellipse";
      radX: number;
      radY: number;
      centerX: number;
      centerY: number;
    }
  | {
      type: "diamond";
      centerX: number;
      centerY: number;
      width: number;
      height: number;
      top: number;
      left: number
    }
  | {
      type: "line";
      sX: number,
      sY : number,
      eX : number,
      eY : number
    }
  | {
      type: "pencil";
    }
  | {
      type: "hand";
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private roomId: string;
  private socket: WebSocket;
  private existingShapes: Shape[];
  private startX = 0;
  private startY = 0;
  private clicked: boolean;
  private selectedTool: Tool = "rect";

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.existingShapes = [];
    this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setSelectedTool(tool: Tool) {
    this.selectedTool = tool;
    console.log(this.selectedTool);
  }

  clearCanvas() {
    //changes needed  //shapes will be persistent
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgb(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes?.map((shape: Shape) => {
      if (shape.type == "rect") {
        this.ctx.strokeStyle = "rgb(255,255,255)";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type == "ellipse") {
        this.ctx.beginPath();
        this.ctx.ellipse(
          shape.centerX,
          shape.centerY,
          shape.radX,
          shape.radY,
          0,
          0,
          2 * Math.PI,
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type == "diamond") {
        const topPoint = { x: shape.centerX, y: shape.top };
        const rightPoint = { x: shape.left + shape.width, y: shape.centerY };
        const bottomPoint = { x: shape.centerX, y: shape.top + shape.height };
        const leftPoint = { x: shape.left, y: shape.centerY };

        this.ctx.beginPath();
        this.ctx.moveTo(topPoint.x, topPoint.y);
        this.ctx.lineTo(rightPoint.x, rightPoint.y);
        this.ctx.lineTo(bottomPoint.x, bottomPoint.y);
        this.ctx.lineTo(leftPoint.x, leftPoint.y);
        this.ctx.closePath();
        this.ctx.stroke();
      } else if (shape.type == "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.sX,shape.sY);
        this.ctx.lineTo(shape.eX,shape.eY);
        this.ctx.closePath();
      } else if (shape.type == "pencil") {
      } else {
      }
    });
  }

  async init() {
    if (!this.ctx) return;
    this.existingShapes = await getExistingShapes(this.roomId);
    //console.log(this.existingShapes,'existing shapes');
    this.clearCanvas();
    //console.log('drawn');
  }

  initHandlers() {
    this.socket.onmessage = (e) => {
      console.log("initHandlers", e);
      const message = JSON.parse(e.data);

      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  mouseDownHandler = (e) => {
    console.log(109, this.selectedTool);
    this.canvas.style.cursor = 'crosshair';
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  };

  mouseUpHandler = (e) => {
    //changes required
    this.canvas.style.cursor = 'default';
    this.clicked = false;

    const endX = e.clientX;
    const endY = e.clientY;

    const width = endX - this.startX;
    const height = endY - this.startY;

    const left = Math.min(this.startX, e.clientX);
    const top = Math.min(this.startY, e.clientY);

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const radX = Math.abs(width) / 2;
    const radY = Math.abs(height) / 2;

    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;
    if (selectedTool == "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width: e.clientX - this.startX,
        height: e.clientY - this.startY,
      };
    } else if (selectedTool == "ellipse") {
      shape = {
        type: "ellipse",
        radX,
        radY,
        centerX: this.startX + width / 2,
        centerY: this.startY + height / 2,
      };
    } else if (this.selectedTool == "diamond") {
      shape = {
        type: 'diamond',
        centerX: centerX,
        centerY,
        top,
        left,
        width,
        height
      }
    } else if (this.selectedTool == "line") {
      shape = {
        type: "line",
        sX: this.startX,
        sY: this.startY,
        eX: endX,
        eY: endY
      }
    } else if (this.selectedTool == "pencil") {
    } else {
    }

    if (!shape) return;

    console.log(149, shape);
    this.existingShapes.push(shape);
    console.log("pushed");
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: this.roomId,
      }),
    );
  };

  mouseMoveHandler = (e) => {
    //changes required
    if (this.clicked) {
      const endX = e.clientX;
      const endY = e.clientY;

      const width = endX - this.startX;
      const height = endY - this.startY;

      const left = Math.min(this.startX, e.clientX);
      const top = Math.min(this.startY, e.clientY);

      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const radX = Math.abs(width) / 2;
      const radY = Math.abs(height) / 2;

      this.clearCanvas();

      this.ctx.strokeStyle = "rgb(255,255,255)";

      if (this.selectedTool == "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (this.selectedTool == "ellipse") {
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, radX, radY, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool == "diamond") {
        const topPoint = { x: centerX, y: top };
        const rightPoint = { x: left + width, y: centerY };
        const bottomPoint = { x: centerX, y: top + height };
        const leftPoint = { x: left, y: centerY };

        this.ctx.beginPath();
        this.ctx.moveTo(topPoint.x, topPoint.y);
        this.ctx.lineTo(rightPoint.x, rightPoint.y);
        this.ctx.lineTo(bottomPoint.x, bottomPoint.y);
        this.ctx.lineTo(leftPoint.x, leftPoint.y);
        this.ctx.closePath();
        this.ctx.stroke();
      } else if (this.selectedTool == "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX,this.startY);
        this.ctx.lineTo(endX,endY);
        this.ctx.stroke();
      } else if (this.selectedTool == "pencil") {
      } else {
      }
    }
  };
}
