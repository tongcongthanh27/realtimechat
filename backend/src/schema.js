// src/schema.js
import { gql } from "graphql-tag";

export const typeDefs = gql`
  # =========================
  # User
  # =========================
  type User {
    id: ID!
    username: String!
  }

  # =========================
  # Message
  # =========================
  type Message {
    id: ID!
    content: String!
    sender: User! # từ User
    to: String! # 'all', 'user:<id>', 'room:<id>'
    createdAt: String!
  }

  # =========================
  # Room
  # =========================
  type Room {
    id: ID!
    name: String!
    members: [User!]!
    createdAt: String!
  }

  # =========================
  # Queries
  # =========================
  type Query {
    me: User
    messages(to: String!): [Message!]!
    rooms: [Room!]!
    room(id: ID!): Room
  }

  # =========================
  # Mutations
  # =========================
  type Mutation {
    register(username: String!, password: String!): String! # JWT
    login(username: String!, password: String!): String! # JWT
    postMessage(content: String!, to: String!): Message!
    createRoom(name: String!, memberIds: [ID!]!): Room!
    addMemberToRoom(roomId: ID!, userId: ID!): Room!
  }

  # =========================
  # Subscriptions
  # =========================
  type Subscription {
    messageAdded(to: String!): Message!
  }
`;
