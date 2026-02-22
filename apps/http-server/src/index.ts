import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@repo/backend-common/config";
import { verifyUser } from "./middleware.js";
import {
  CreateRoomSchema as RoomSchema,
  SignInSchema,
  userSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import cors from "cors";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parsedData = userSchema.safeParse(req.body);
  if (!parsedData.success)
    return res.status(404).json({ message: "Incorrect credentials" });
  const { username, email, password } = parsedData.data;
  try {
    const alreadyPresent = await prismaClient.user.findUnique({
      where: { email },
    });
    if (alreadyPresent)
      return res
        .status(404)
        .json({ message: "Email already connected to another account" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: {
        email,
        name: username,
        password: hashed,
      },
    });
    const token = jwt.sign({ id: user?.id }, JWT_SECRET);
    res.cookie('token',token,{
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    return res.json({message: 'Registered successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);
  if (!parsedData.success)
    return res.json({ message: "Incorrect credentials" });
  const { email, password } = parsedData.data;
  try {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ message: "Wrong Credentials" });
    const token = jwt.sign({ id: user?.id }, JWT_SECRET);
    res.cookie('token',token,{
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    return res.json({message: 'Logged-In successfully'});
  } catch (error) {
    return res.json({ message: "Internal Server Error" });
  }
});

app.post("/room", verifyUser, async (req, res) => {
  const parsedData = RoomSchema.safeParse(req.body);
  if (!parsedData.success)
    return res.json({ message: "Incorrect credentials" });
  try {
    const userId = req.userId;
    const roomId = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        admin: { connect: { id: userId } },
      },
    });
    return res.json(roomId);
  } catch (error) {
    return res.status(500).json({ message: "bug in /room endpt" });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const messages = await prismaClient.room.findMany({
    where: {
      id: roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });
  return res.json({ messages });
});

app.get("/room/:slug", async (req, res) => { //returning room/id
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug
    }
  });
  return res.json({ room });
});

app.use("/", (req, res) => {
  res.send("Working");
});

app.listen(3001, () => {
  console.log(`Server started 3001`);
});
