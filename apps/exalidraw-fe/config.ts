import 'dotenv/config';

export const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND;
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

console.log(process.env.NEXT_PUBLIC_HTTP_BACKEND!);
console.log(process.env.WS_URL!);