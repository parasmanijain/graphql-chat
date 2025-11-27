import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { createMessage, getMessages } from "./db/messages.js";

const pubSub = new PubSub();

export interface GraphQLContext {
  user: string;
}

interface CreateMessageArgs {
  text: string;
}

export const resolvers = {
  Query: {
    messages: (_root: unknown, _args: unknown, { user }: GraphQLContext) => {
      if (!user) throw unauthorizedError();
      return getMessages();
    },
  },

  Mutation: {
    addMessage: async (
      _root: unknown,
      { text }: CreateMessageArgs,
      { user }: GraphQLContext
    ) => {
      if (!user) throw unauthorizedError();
      const message = await createMessage(user, text);
      pubSub.publish("MESSAGE_ADDED", { messageAdded: message });
      return message;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: (_root: unknown, _args: unknown, { user }: GraphQLContext) => {
        if (!user) throw unauthorizedError();
        return pubSub.asyncIterableIterator("MESSAGE_ADDED");
      },
    },
  },
};

function unauthorizedError() {
  return new GraphQLError("Not authenticated", {
    extensions: { code: "UNAUTHORIZED" },
  });
}
