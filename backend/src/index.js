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
import jwt from "jsonwebtoken";
import { pubsub } from "./pubsub.js";

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
const httpContext = async ({ req }) => {
  const auth = req.headers.authorization || "";
  let user = null;
  if (auth) {
    try {
      const token = auth.replace("Bearer ", "");
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("Invalid token for HTTP request: ", err);
    }
  }
  return { user };
};
app.use(
  cors(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: httpContext,
  })
);

// 4. HTTP server chung
const httpServer = http.createServer(app);

// 5. WebSocket server trên cùng httpServer
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const wsContext = async (ctx) => {
  // ⚠ Token được gửi từ Client trong connectionParams
  const authHeader = ctx.connectionParams?.authorization || "";
  let user = null;

  if (authHeader && typeof authHeader === "string") {
    try {
      const token = authHeader.replace("Bearer ", "");
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("Invalid token for WS connection: ", err);
    }
  }

  return {
    pubsub,
    user,
  };
};

useServer(
  {
    schema,
    context: wsContext,
    onConnect: async (ctx) => {
      const context = await wsContext(ctx);
      if (!context.user) {
        console.log("Unauthorized: Missing or invalid token for subscription.");
        throw new Error("Unauthorized: Missing or invalid token for subscription.");
      }
      return true;
    },
  },
  wsServer
);

// 6. Listen
const PORT = process.env.PORT || 4000;
dbConfig.connectDb().then(async () => {
  console.log("Connect db successfull");
  httpServer.listen(PORT, () => {
    console.log(`HTTP + WS GraphQL server at http://localhost:${PORT}/graphql`);
    console.log(`WebSocket ready at ws://localhost:${PORT}/graphql`);
  });
});

// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@as-integrations/express5";
// import express from "express";
// import http from "http";
// import cors from "cors";
// import bodyParser from "body-parser";
// import { WebSocketServer } from "ws";
// import { useServer } from "graphql-ws/use/ws";
// import { makeExecutableSchema } from "@graphql-tools/schema";
// import dotenv from "dotenv";
// import jwt from "jsonwebtoken";
// import { pubsub } from "./pubsub.js";

// dotenv.config();

// import { typeDefs } from "./schema.js";
// import { resolvers } from "./resolvers.js";
// import dbConfig from "./core/dbConfig.js";

// // 1. Schema
// const schema = makeExecutableSchema({ typeDefs, resolvers });

// // 2. Apollo Server instance
// const server = new ApolloServer({ schema });
// await server.start();

// // 3. Express app
// const app = express();
// const httpContext = async ({ req }) => {
//   const auth = req.headers.authorization || "";
//   let user = null;
//   if (auth) {
//     try {
//       const token = auth.replace("Bearer ", "");
//       user = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       console.log("Invalid token for HTTP request: ", err);
//     }
//   }
//   return { user };
// };
// app.use(
//   "/graphql",
//   cors(),
//   bodyParser.json(),
//   expressMiddleware(server, {
//     context: httpContext,
//   })
// );

// // 4. HTTP server chung
// const httpServer = http.createServer(app);

// // 5a. HTTP server riêng cho WebSocket Handshake (trên cổng 5000)
// // Đây là cách đơn giản để host WS server trên cổng riêng
// const wsHttpServer = http.createServer((req, res) => {
//   res.writeHead(404);
//   res.end();
// });

// // 5. WebSocket server trên cùng httpServer
// const wsServer = new WebSocketServer({
//   server: wsHttpServer,
//   path: "/graphql",
// });

// const wsContext = async (ctx) => {
//   const authHeader = ctx.connectionParams?.authorization || "";
//   let user = null;

//   if (authHeader && typeof authHeader === "string") {
//     try {
//       const token = authHeader.replace("Bearer ", "");
//       user = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("connect :", user);
//     } catch (err) {
//       console.log("Invalid token for WS connection: ", err);
//     }
//   }

//   return {
//     pubsub,
//     user,
//   };
// };

// useServer(
//   {
//     schema,
//     context: wsContext,
//     onConnect: async (ctx) => {
//       const context = await wsContext(ctx);
//       if (!context.user) {
//         console.log("Unauthorized: Missing or invalid token for subscription.");
//         throw new Error("Unauthorized: Missing or invalid token for subscription.");
//       }
//       return true;
//     },
//   },
//   wsServer
// );

// const HTTP_PORT = process.env.PORT || 4000;
// // Cổng cho WebSocket (Subscription)
// const WS_PORT = process.env.WS_PORT || 5000;
// // 6. Listen
// dbConfig.connectDb().then(async () => {
//   console.log("Connect db successfull");

//   // Lắng nghe HTTP Server (Query/Mutation)
//   httpServer.listen(HTTP_PORT, () => {
//     console.log(`HTTP GraphQL server (Query/Mutation) at http://localhost:${HTTP_PORT}/graphql`);
//   });

//   // Lắng nghe WebSocket Server (Subscription)
//   wsHttpServer.listen(WS_PORT, () => {
//     console.log(`WebSocket server (Subscription) ready at ws://localhost:${WS_PORT}/graphql`);
//   });
// });
