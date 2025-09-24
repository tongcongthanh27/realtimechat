import Room from "../models/room.js";

export const roomResolvers = {
  Query: {
    rooms: async () => Room.find().populate("members"),
    room: async (_, { id }) => Room.findById(id).populate("members"),
  },
  Mutation: {
    createRoom: async (_, { name, memberIds }) => {
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
