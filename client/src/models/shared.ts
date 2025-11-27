export interface User {
  username: string;
}

export interface Message {
  id: string;
  user: string;
  text: string;
}

export type MessagesQueryResult = {
  messages: Message[];
};

export type AddMessageResult = {
  addMessage: Message;
};

export type AddMessageVars = {
  text: string;
};

export type MessageAddedResult = {
  message: Message;
};
