import { gql } from "@apollo/client";

export const GET_LIST_MESSAGE_QUERY = gql`
  query GetListMessage($receiverId: String!) {
    getListMessage(receiverId: $receiverId) {
      id
      content
      createdAt
      sender {
        id
        username
      }
      receiverUser {
        id
        username
      }
      receiverRoom {
        id
        name
        createdAt
      }
    }
  }
`;
