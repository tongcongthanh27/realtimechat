import { gql } from "@apollo/client";

export const GET_LIST_USER_QUERY = gql`
  query GetListUser {
    getListUser {
      id
      username
    }
  }
`;
