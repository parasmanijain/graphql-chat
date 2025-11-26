import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import {
  addMessageMutation,
  messageAddedSubscription,
  messagesQuery,
} from "./queries.js";

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text: string) => {
    const {
      data: { message },
    } = await mutate({
      variables: { text },
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  useSubscription(messageAddedSubscription, {
    onData: ({ client, data }) => {
      const newMessage = data.data.message;
      client.cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
        return { messages: [...messages, newMessage] };
      });
    },
  });
  return {
    messages: data?.messages ?? [],
  };
}
