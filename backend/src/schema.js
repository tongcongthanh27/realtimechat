// src/schema.js
import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }
  type Room {
    id: ID!
    name: String!
    members: [User!]!
    createdAt: String!
  }
  type Message {
    id: ID!
    content: String!
    sender: User! # từ User
    receiverUser: User
    receiverRoom: Room
    createdAt: String!
  }
  type LoginResponse {
    token: String!
    user: User!
  }
  type RegisterResponse {
    user: User!
  }

  type Query {
    getListUser: [User!]
    getUser(id: ID!): User!

    getListRoom: [Room!]!
    getRoom(id: ID!): Room!

    getListMessage(receiverId: String!): [Message!]!
  }
  type Mutation {
    register(username: String!, password: String!): RegisterResponse!
    login(username: String!, password: String!): LoginResponse!

    postMessage(content: String!, receiverId: String!): Message!

    createRoom(name: String!, memberIds: [ID!]!): Room!
    addMemberToRoom(roomId: ID!, userId: ID!): Room!
  }

  # =========================
  # Subscriptions
  # =========================
  type Subscription {
    messageAdded(receiverId: String!): Message!
  }
`;
