"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomSchema = exports.SignInSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    username: zod_1.z.string()?.min(3),
    password: zod_1.z.string(),
    email: zod_1.z.string()
});
exports.SignInSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string()
});
exports.CreateRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(20),
});
