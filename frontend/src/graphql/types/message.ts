import type { Room } from "./room";
import type { User } from "./user";

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: User;
  receiverUser: User;
  receiverRoom: Room;
}
