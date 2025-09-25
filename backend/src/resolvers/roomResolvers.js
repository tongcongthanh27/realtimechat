import Room from "../models/room.js";
import { GraphQLError } from "graphql";
import { statusCode } from "../core/statusCode.js";

export const roomResolvers = {
  Query: {
    getListRoom: async (_, __, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: statusCode.UNAUTHENTICATED },
        });
      }
      const rooms = Room.find().populate("members");
      return rooms;
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
