import { WebSocketServer, WebSocket } from "ws";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

let users: User[] = [];

function gettokenfromCookie(cookie?: string) {
  if (!cookie) return null;

  let cookies = cookie.split(";");

  for (let cooki of cookies) {
    let [key, value] = cooki.trim().split("=");
    if (key === "token") return value;
  }
  return null;
}

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
  console.log("WebSocket server running on ws://localhost:8080");
});

wss.on("connection", function connection(ws, request) {
  // const url = request.url;
  // if (!url) return;
  // const queryParams = new URLSearchParams(url.split("?")[1]);
  // const token = queryParams.get("token") || "";
  const token = gettokenfromCookie(request.headers.cookie);
  if (token == null) {
    ws.close();
    return;
  }

  const user = checkUser(token);

  if (user == null) {
    ws.close();
    return;
  }
  users.push({
    ws: ws,
    rooms: [],
    userId: user,
  });

  ws.on("message", async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
      console.log(typeof parsedData);
    }

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws == ws);
      if (!user?.rooms.includes(parsedData.roomId)) {
        user?.rooms.push(parsedData.roomId);
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws == ws);
      if (!user) return;
      user.rooms = user?.rooms.filter((x) => x !== parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const room = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId: Number(room),
          message,
          userId: user,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(room)) {
          console.log(user.userId, " ", user.rooms);
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              room,
            }),
          );
        }
      });
    }
  });
});
