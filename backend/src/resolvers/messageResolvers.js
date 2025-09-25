import Message from "../models/message.js";
import User from "../models/user.js";
import { pubsub } from "../pubsub.js";
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
        return Message.find({ receiverUser }).populate("receiverUser");
      }

      return Message.find({ receiverRoom }).populate("receiverRoom");
    },
  },
  Mutation: {
    postMessage: async (_, { content, receiverId }, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: statusCode.UNAUTHENTICATED },
        });
      }
      const existUser = await User.findById(receiverId);
      let message = null;
      let populated = null;
      if (existUser) {
        message = new Message({ content, sender: user.id, receiverUser: receiverId });
        await message.save();
        populated = await message.populate([{ path: "receiverUser" }, { path: "sender" }]);
      } else {
        message = new Message({ content, sender: user.id, receiverRoom: receiverId });
        await message.save();
        populated = await message.populate([{ path: "receiverRoom" }, { path: "sender" }]);
      }
      pubsub.publish("MESSAGE_ADDED", { messageAdded: populated, receiverId: receiverId });
      return populated;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (_, args, { pubsub }) => pubsub.asyncIterator("MESSAGE_ADDED"),
      resolve: (payload, args) => {
        // console.log(payload);
        if (payload.receiverId === args.receiverId || payload.receiverId === "all") {
          return payload.messageAdded;
        }
        return null;
      },
    },
  },
};
