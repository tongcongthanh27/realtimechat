import Room from "../models/room.js";
import { GraphQLError } from "graphql";
import { statusCode } from "../core/statusCode.js";

export const roomResolvers = {
  Query: {
    getListRoom: async (_, { receiverId }, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: statusCode.UNAUTHENTICATED },
        });
      }
      // console.log(receiverId);
      const rooms = await Room.find().populate("members");
      // console.log(rooms[0].members);
      const res = rooms.filter((room) => room.members.some((m) => m.id.toString() === receiverId));
      // console.log(res.length);
      return res;
    },
    getRoom: async (_, { id }, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: statusCode.UNAUTHENTICATED },
        });
      }
      const room = Room.findById(id).populate("members");
      return room;
    },
  },
  Mutation: {
    createRoom: async (_, { name, memberIds }, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: statusCode.UNAUTHENTICATED },
        });
      }
      const room = new Room({ name, members: memberIds });
      await room.save();
      return room.populate("members");
    },
    addMemberToRoom: async (_, { roomId, userId }) => {
      const room = await Room.findById(roomId);
      if (!room) throw new Error("Room not found");
      room.members.push(userId);
      await room.save();
      return room.populate("members");
    },
  },
};
