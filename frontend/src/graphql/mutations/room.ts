import { gql } from "@apollo/client";

export const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoom($name: String!, $memberIds: [ID!]!) {
    createRoom(name: $name, memberIds: $memberIds) {
      id
      name
      createdAt
      members {
        id
        username
      }
    }
  }
`;
