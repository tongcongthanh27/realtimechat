import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { statusCode } from "../core/statusCode.js";
import dotenv from "dotenv";
import { GraphQLError } from "graphql";
dotenv.config();

export const userResolvers = {
  Query: {
    getUser: async (_, { id }, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: statusCode.UNAUTHENTICATED },
        });
      }
      const userData = await User.findById(id);
      return userData;
    },
    getListUser: async (_, __, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: statusCode.UNAUTHENTICATED },
        });
      }
      const users = await User.find({});
      return users.map((u) => ({
        id: u.id,
        username: u.username,
      }));
    },
  },
  Mutation: {
    register: async (_, { username, password }) => {
      const hashed = await bcrypt.hash(password, 10);

      const existUser = await User.findOne({ username: username });
      if (existUser) {
        throw new GraphQLError("Username existing", {
          extensions: { code: statusCode.BAD_USER_INPUT },
        });
      }

      const user = new User({ username, password: hashed });
      await user.save();
      return {
        user: { username: username, id: user.id },
      };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username }).select("+password");
      if (!user)
        throw new GraphQLError("User not found", {
          extensions: { code: statusCode.BAD_USER_INPUT },
        });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid)
        throw new GraphQLError("Invalid password", {
          extensions: { code: statusCode.BAD_USER_INPUT },
        });
      return {
        token: jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET),
        user: { username: username, id: user.id },
      };
    },
  },
};
