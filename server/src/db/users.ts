import { connection } from "./connection.js";

const getUserTable = () => connection.table("user");

export interface User {
  username: string;
  password: string;
}

export async function getUser(username: string): Promise<User | undefined> {
  return await getUserTable().first().where({ username });
}
