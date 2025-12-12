import express from "express";
import bcrypt from "bcrypt";
import { CreateRoomSchema, SignInSchema, userSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/index"
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import { verifyUser } from "./middleware.js";

declare global{
  namespace Express{
    interface Request{
      userId?:string
    }
  }
}

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = userSchema.safeParse(req.body);
  if(!parsedData.success)
    return res.json({message:"Incorrect credentials"});
  const { username, email, password } = parsedData.data;
  try {
    const alreadyPresent = await prismaClient.user.findUnique({
      where:{email}
    });
    if(alreadyPresent)
      return res.json({message:"Email already connected to another account"});
    const hashed = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({data:
      {
        email,
        username,
        hashed
      }
    });
    const token = jwt.sign({id:user?.id},JWT_SECRET);
    return res.json(token);
  } catch (error) {
    return res.json({message:"Internal Server Error"});
  }
});

app.post("/signin",async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);
  if(!parsedData.success)
    return res.json({message:"Incorrect credentials"});
  const { username, password } = parsedData.data;
  try {
    const user = await prismaClient.user.findUnique({
      where:{username}
    });
    if(!user)
      return res.json({message:"User not found"});
    const match = await bcrypt.compare(password,user.password);
    if(!match)
      return res.json({message:"Wrong Credentials"});
    const token = jwt.sign({id:user?.id},JWT_SECRET);
    return res.json(token);
  }
   catch (error) {
    return res.json({message:"Internal Server Error"});
  }
});

app.post("/room",verifyUser,async (req,res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if(!parsedData.success)
    return res.json({message:"Incorrect credentials"});
  try {
    const userId = req.userId;
    const roomId = await prismaClient.room.create({
    data:{
      slug: parsedData.data.name,
      adminId : userId
    }
    });
  return res.json(roomId);
  } catch (error) {
    return res.status(411).json({message:"Room already exists."});
  }
});

app.listen(3000);
