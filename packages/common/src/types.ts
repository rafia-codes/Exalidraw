import { z } from 'zod';

const userSchema= z.object({
    username : z.string()?.min(3),
    password : z.string(),
    email : z.string()
});

const SignInSchema= z.object({
    email : z.email(),
    password: z.string()
});

const CreateRoomSchema = z.object({
    name : z.string().min(3).max(20),
});

export { userSchema, SignInSchema, CreateRoomSchema};