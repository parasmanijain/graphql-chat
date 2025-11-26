import { useAddMessage, useMessages } from '../lib/graphql/hooks.js';
import MessageInput from './MessageInput.js';
import MessageList from './MessageList.js';

function Chat({ user }: { user: string }) {
  const { messages } = useMessages();
  const { addMessage } = useAddMessage();

  const handleSend = async (text: string) => {
    const message = await addMessage(text);
    console.log('Message added:', message);
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-4">
          {`Chatting as ${user}`}
        </h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
}

export default Chat;
