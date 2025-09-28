import { gql } from "@apollo/client";

export const POST_MESSAGE_MUTATION = gql`
  mutation PostMessage($content: String!, $receiverId: String!) {
    postMessage(content: $content, receiverId: $receiverId) {
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
