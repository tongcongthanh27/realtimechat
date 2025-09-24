import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import dotenv from "dotenv";
dotenv.config();

import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import dbConfig from "./core/dbConfig.js";

// 1. Schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// 2. Apollo Server instance
const server = new ApolloServer({ schema });
await server.start();

// 3. Express app
const app = express();
app.use(cors(), bodyParser.json(), expressMiddleware(server));

// 4. HTTP server chung
const httpServer = http.createServer(app);

// 5. WebSocket server trên cùng httpServer
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
useServer({ schema }, wsServer);

// 6. Listen
const PORT = process.env.PORT || 4000;
dbConfig.connectDb().then(async () => {
  console.log("Connect db successfull");
  httpServer.listen(PORT, () => {
    console.log(`HTTP + WS GraphQL server at http://localhost:${PORT}/graphql`);
    console.log(`WebSocket ready at ws://localhost:${PORT}/graphql`);
  });
});
