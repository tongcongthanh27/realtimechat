import Message from "../models/message.js";
import { pubsub } from "../pubsub.js";

export const messageResolvers = {
  Query: {
    messages: async (_, { to }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return Message.find({ to }).populate("from");
    },
  },
  Mutation: {
    postMessage: async (_, { content, to }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const message = new Message({ content, from: user.id, to });
      await message.save();
      const populated = await message.populate("from");
      pubsub.publish("MESSAGE_ADDED", { messageAdded: populated, to });
      return populated;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(["MESSAGE_ADDED"]),
      resolve: (payload, args) => {
        // chỉ gửi cho đúng phòng hoặc all
        if (payload.to === args.to || payload.to === "all") {
          return payload.messageAdded;
        }
        return null;
      },
    },
  },
};
