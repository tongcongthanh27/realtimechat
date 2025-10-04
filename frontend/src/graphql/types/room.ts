import type { User } from "./user";

export interface Room {
  id: string;
  name: string;
  members: User[];
  createdAt: string;
}
