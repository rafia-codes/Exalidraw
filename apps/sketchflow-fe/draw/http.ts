import axios from "axios";
import { HTTP_BACKEND } from "@/config";

export default async function getExistingShapes(roomId:string){
   if(roomId.startsWith('guest-'))return [];
   const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
   const shapes = res.data.shapes;
   return shapes?shapes:[];
}

