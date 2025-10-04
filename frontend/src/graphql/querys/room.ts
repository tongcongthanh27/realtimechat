import { gql } from "@apollo/client";

export const GET_LIST_ROOM_QUERY = gql`
  query GetListRoom($receiverId: String!) {
    getListRoom(receiverId: $receiverId) {
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
