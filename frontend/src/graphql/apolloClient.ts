import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import type { OperationDefinitionNode } from "graphql";
import { store } from "../redux/store";
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

// WS link cho subscription
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    // url: "ws://localhost:5000/graphql",
    lazy: true,
    connectionParams: () => {
      const token = store.getState().user.token;
      console.log(token);
      return {
        authorization: token ? `Bearer ${token}` : "",
      };
    },
    on: {
      connected: () => console.log("✅ WebSocket connected"),
      closed: (event) => console.log("❌ WebSocket closed", event),
    },
    onNonLazyError: (error) => console.log("❌ WebSocket connection error:", error),
  })
);

// Chọn link tùy theo operation
const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query) as OperationDefinitionNode;
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink
);

// Tạo Apollo Client
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
