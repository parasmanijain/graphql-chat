import { Message } from "../models/shared.js";

interface MessageRowProps {
    user: string;
    message: Message;
}

export const MessageRow = ({ user, message }: MessageRowProps) => {
    return (
        <tr>
            <td className="py-1">
                <span className={message.user === user ? "tag is-primary" : "tag"}>
                    {message.user}
                </span>
            </td>
            <td className="pl-4 py-1">{message.text}</td>
        </tr>
    );
}