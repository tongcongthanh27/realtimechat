import { gql } from "@apollo/client";

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription MessageAdded($receiverId: String!) {
    messageAdded(receiverId: $receiverId) {
      id
      content
      createdAt
      sender {
        id
        username
      }
      receiverRoom {
        id
        name
        createdAt
      }
      receiverUser {
        id
        username
      }
    }
  }
`;
