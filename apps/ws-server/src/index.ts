import { WebSocketServer } from "ws";
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config"

const wss = new WebSocketServer({port:8080});

function checkUser(token: string): boolean{
    const payload=jwt.verify(token,JWT_SECRET) as JwtPayload;
    if(!payload || !(typeof payload == "string")){
        wss.close();
        return false;
    }
    return true;
}

wss.on('connection',function connection(ws,request){
    const url=request.url;
    if(!url)return;
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token=queryParams.get('token') || "";
    const userAuthenticated = checkUser(token);
    ws.on('message',function message(data){
        ws.send('pong');
    })
})
