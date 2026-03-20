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

  users.push({
          ws: ws,
          rooms: [],
          userId: userId,
  });

  ws.on("close", () => {
    users = users.filter((u) => u.ws !== ws);
  });

  ws.on("message", async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
      console.log(typeof parsedData);
    }

    if (parsedData.type === "auth" && parsedData.token) {
      try {
        const verified = checkUser(parsedData.token);
        if (!verified) {
          ws.close();
          return;
        }
        userId = verified;

        const idx = users.findIndex(u => u.ws === ws);
        if(idx !== -1 && users[idx]) users[idx].userId = userId;
      } catch (error) {
        ws.send(
          JSON.stringify({ type: "auth_error", message: "Invalid token" }),
        );
        ws.close();
      } 
    }

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws == ws);
      if (!user) return;
      if (!user.rooms.includes(parsedData.roomId)) {
        user?.rooms.push(parsedData.roomId);
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws == ws);
      if (!user) return;
      user.rooms = user.rooms.filter((room) => room !== parsedData.roomId);
    }

    if (parsedData.type === "updated") {
      const roomId = parsedData.roomId;
      const shapes = parsedData.shapes;

      const shape = JSON.stringify(shapes[shapes.length - 1]);
      console.log(roomId);

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

      users.forEach((user: User) => {
        if (user.ws !== ws && user?.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "updated",
              roomId,
              shapes,
            }),
          );
        }
      });
    }

    // if (parsedData.type === "chat") {
    //   const room = parsedData.roomId;
    //   const message = parsedData.message;

    //   await prismaClient.chat.create({
    //     data: {
    //       roomId: Number(room),
    //       message,
    //       userId: user,
    //     },
    //   });

    //   users.forEach((user) => {
    //     if (user.rooms.includes(room)) {
    //       console.log(user.userId, " ", user.rooms);
    //       user.ws.send(
    //         JSON.stringify({
    //           type: "chat",
    //           message: message,
    //           room,
    //         }),
    //       );
    //     }
    //   });
    // }
  });
});
