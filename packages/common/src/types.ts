import { z } from 'zod';

export const userSchema= z.object({
    username : z.string()?.min(3),
    password : z.string(),
    email : z.string()
});

export const SignInSchema= z.object({
    email : z.email(),
    password: z.string()
});

export const CreateRoomSchema = z.object({
    name : z.string().min(3).max(20),
});
