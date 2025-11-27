import { ApolloServer } from "@apollo/server";
import path from "path";
import { expressMiddleware as apolloMiddleware } from "@as-integrations/express5";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import express from "express";
import type { Request } from "express-jwt";
import { readFile } from "node:fs/promises";
import { useServer as useWsServer } from "graphql-ws/use/ws";
import { createServer as createHttpServer } from "node:http";
import { WebSocketServer } from "ws";
import { authMiddleware, decodeToken, handleLogin } from "./auth.js";
import { GraphQLContext, resolvers } from "./resolvers.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

async function getHttpContext({
  req,
}: {
  req: Request;
}): Promise<GraphQLContext> {
  const context: GraphQLContext = {
    user: "",
  };

  if (req.auth?.sub) {
    return { user: req.auth.sub };
  }
  return context;
}

function getWsContext({
  connectionParams,
}: {
  connectionParams: Record<string, any> | undefined;
}) {
  const accessToken = connectionParams?.accessToken;
  if (accessToken) {
    const payload = decodeToken(accessToken);
    return { user: payload.sub };
  }
  return {};
}

const typeDefs = await readFile(path.resolve("src/schema.graphql"), "utf8");
const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ schema });
await apolloServer.start();

app.use(
  "/graphql",
  apolloMiddleware(apolloServer, { context: getHttpContext })
);

const httpServer = createHttpServer(app);
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });
useWsServer({ schema, context: getWsContext }, wsServer);

httpServer.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
