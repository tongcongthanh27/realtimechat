import { gql } from "@apollo/client";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageAdded {
    messageAdded {
      id
      content
      user
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($user: String!, $content: String!) {
    sendMessage(user: $user, content: $content) {
      id
      content
      user
    }
  }
`;
