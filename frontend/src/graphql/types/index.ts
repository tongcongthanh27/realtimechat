import type { Message } from "./message";
import type { Room } from "./room";
import type { User } from "./user";

export interface RegisterResponse {
  register: {
    user: {
      id: string;
      username: string;
    };
  };
}

export interface LoginResponse {
  login: {
    token: string;
    user: {
      id: string;
      username: string;
    };
  };
}
export interface ListUserResponse {
  getListUser: User[];
}

export interface CreateRoomResponse {
  createRoom: Room;
}

export interface GetListRoomResponse {
  getListRoom: Room[];
}

export interface PostMessageResponse {
  postMessage: Message;
}

export interface MessageAddedPayload {
  messageAdded: Message;
}

export interface GetListMessageResponse {
  getListMessage: Message[];
}
