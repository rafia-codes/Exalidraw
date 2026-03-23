import { WebSocketServer, WebSocket } from "ws";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  userId: string;
}

const rooms : Map<string,Set<User>> = new Map(); //roomId --> set of Users

// function gettokenfromCookie(cookie?: string) {
//   if (!cookie) return null;

//   let cookies = cookie.split(";");

//   for (let cooki of cookies) {
//     let [key, value] = cooki.trim().split("=");
//     if (key === "token") return value;
//   }
//   return null;
// }

function checkUser(token: string): string | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!payload || !payload.id) {
      return null;
    }
    return payload.id as string;
  } catch (error) {
    return null;
  }
}

wss.on("listening", () => {
  console.log("WebSocket server running");
});

wss.on("connection", function connection(ws, request) {
  let userId: string | null = null;

  userId = "guest-" + crypto.randomUUID();

  ws.on("message", async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    if (parsedData.type === "auth" && parsedData.token) {
      try {
        const verified = checkUser(parsedData.token);
        if (!verified) {
          ws.close();
          return;
        }
        userId = verified;
      } catch (error) {
        ws.send(
          JSON.stringify({ type: "auth_error", message: "Invalid token" }),
        );
        ws.close();
      }
    }

    if (parsedData.type === "join_room") {
    const roomUsers = rooms.get(parsedData.roomId) || new Set<User>();
    roomUsers.add({ ws, userId: userId! });
    rooms.set(parsedData.roomId, roomUsers);
    }

    if (parsedData.type === "leave_room") {
      const roomUsers = rooms.get(parsedData.roomId);
      if(roomUsers){
        roomUsers.forEach((u)=>{
          if(u.ws === ws)
            roomUsers.delete(u);
        });
        if(roomUsers.size == 0)rooms.delete(parsedData.roomId);
      }
      ws.close();
    }

    if (parsedData.type === "updated") {
      const roomId = parsedData.roomId;
      const shapes = parsedData.shapes;
      const shape = JSON.stringify(shapes[shapes.length - 1]);

      if (
        parsedData.action == "push" &&
        shapes.length > 0 &&
        !roomId.startsWith("guest-")
      ) {
        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message: shape,
            userId: userId,
          },
        });
      }

      rooms.get(roomId)?.forEach((user) => {
        user.ws.send(JSON.stringify({
          type: "updated",
              roomId,
              shapes,
        }))
      })

    }
  });
});
