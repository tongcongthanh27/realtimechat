import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./resolvers/userResolvers.js";
import { messageResolvers } from "./resolvers/messageResolvers.js";
import { roomResolvers } from "./resolvers/roomResolvers.js";

export const resolvers = mergeResolvers([userResolvers, messageResolvers, roomResolvers]);
