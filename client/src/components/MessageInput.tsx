import { KeyboardEvent } from "react";

interface MessageInputProps {
  onSend: (a: string) => Promise<void>;
}


export const MessageInput = ({ onSend }: MessageInputProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSend(event.currentTarget.value);
      event.currentTarget.value = '';
    }
  };

  return (
    <div className="box">
      <div className="control">
        <input className="input" type="text" placeholder="Say something..."
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}