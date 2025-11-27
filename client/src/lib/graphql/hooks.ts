import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import {
  addMessageMutation,
  messageAddedSubscription,
  messagesQuery,
} from "./queries.js";
import {
  AddMessageResult,
  AddMessageVars,
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

  useSubscription<any>(messageAddedSubscription, {
    onData: ({ client, data }) => {
      const newMessage = data.data.message;
      client.cache.updateQuery<any>(
        { query: messagesQuery },
        ({ messages }) => {
          return { messages: [...messages, newMessage] };
        }
      );
    },
  });

  return {
    messages: data?.messages ?? [],
  };
}
