import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = "SUPER_SECRET_KEY";

export const userResolvers = {
  Query: {
    me: (_, __, { user }) => user,
  },
  Mutation: {
    register: async (_, { username, password }) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashed });
      await user.save();
      return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");
      return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    },
  },
};
