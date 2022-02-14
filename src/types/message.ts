
export type MessageType = 'user' | 'system';

export interface Message {
    type: MessageType;
    author: string;
    content: string;
}
