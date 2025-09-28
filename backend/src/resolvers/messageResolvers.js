import Message from "../models/message.js";
import Room from "../models/room.js";
import User from "../models/user.js";
import { ee, pubsub } from "../pubsub.js";
import { GraphQLError } from "graphql";
import { statusCode } from "../core/statusCode.js";

export const messageResolvers = {
  Query: {
    getListMessage: async (_, { receiverId }, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: statusCode.UNAUTHENTICATED },
        });
      }
      const existUser = await User.findById(receiverId);
      if (existUser) {
        console.log(1);
        return Message.find({
          $or: [
            { receiverUser: receiverId, sender: user.id },
            { receiverUser: user.id, sender: receiverId },
          ],
        }).populate([{ path: "receiverUser" }, { path: "sender" }]);
      }
      console.log(receiverId);
      return Message.find({ receiverRoom: receiverId }).populate([{ path: "receiverRoom" }, { path: "sender" }]);
    },
  },
  Mutation: {
    postMessage: async (_, { content, receiverId }, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: statusCode.UNAUTHENTICATED },
        });
      }
      const existRoom = await Room.findById(receiverId);
      let message = null;
      let populated = null;
      if (!existRoom) {
        message = new Message({ content, sender: user.id, receiverUser: receiverId });
        await message.save();
        populated = await message.populate([{ path: "receiverUser" }, { path: "sender" }]);
        pubsub.publish(`MESSAGE_ADDED_${receiverId}`, { messageAdded: populated, receiverId: receiverId });
      } else {
        message = new Message({ content, sender: user.id, receiverRoom: receiverId });
        await message.save();
        populated = await message.populate([{ path: "receiverRoom" }, { path: "sender" }]);
        existRoom.members.forEach((memberId) => {
          if (memberId.toString() !== user.id) {
            pubsub.publish(`MESSAGE_ADDED_${memberId.toString()}`, {
              messageAdded: populated,
              receiverId: memberId.toString(),
            });
          }
        });
      }
      console.log("sub");
      console.log("Listener count:", ee.listenerCount(`MESSAGE_ADDED_${receiverId}`));
      return populated;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (_, args, { pubsub }) => pubsub.asyncIterator(`MESSAGE_ADDED_${args.receiverId}`),
      resolve: (payload, args) => {
        // console.log(payload.receiverId, args.receiverId);
        if (payload.receiverId === args.receiverId) {
          // console.log(1);
          return payload.messageAdded;
        }
        return null;
      },
    },
  },
};
