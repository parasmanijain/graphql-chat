import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import {
  addMessageMutation,
  messageAddedSubscription,
  messagesQuery,
} from "./queries.js";
import {
  AddMessageResult,
  AddMessageVars,
  MessageAddedResult,
  MessagesQueryResult,
} from "../../models/shared.js";

export function useAddMessage() {
  const [mutate] = useMutation<AddMessageResult, AddMessageVars>(
    addMessageMutation
  );

  const addMessage = async (text: string) => {
    const { data } = await mutate({ variables: { text } });

    if (!data) return null;

    return data.addMessage;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery<MessagesQueryResult>(messagesQuery);

  useSubscription<MessageAddedResult>(messageAddedSubscription, {
    onData: ({ client, data }) => {
      if (!data?.data) return;
      const newMessage = data.data.messageAdded;

      client.cache.updateQuery<MessagesQueryResult>(
        { query: messagesQuery },
        (prev) => {
          if (!prev) return { messages: [newMessage] };
          return { messages: [...prev.messages, newMessage] };
        }
      );
    },
  });

  return {
    messages: data?.messages ?? [],
  };
}
