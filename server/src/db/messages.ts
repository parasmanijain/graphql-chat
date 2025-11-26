import { connection } from "./connection.js";
import { generateId } from "./ids.js";

export interface Message {
  id: string;
  user: string;
  text: string;
  createdAt: string;
}

const getMessageTable = () => connection.table<Message>("message");

export async function getMessages(): Promise<Message[]> {
  return await getMessageTable().select().orderBy("createdAt", "asc");
}

export async function createMessage(
  user: string,
  text: string
): Promise<Message> {
  const message = {
    id: generateId(),
    user,
    text,
    createdAt: new Date().toISOString(),
  };
  await getMessageTable().insert(message);
  return message;
}
